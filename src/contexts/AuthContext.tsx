
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, LoginCredentials, SignupCredentials, User, UserRole } from '@/types/auth';
import { toast } from '@/components/ui/sonner';

interface AuthContextProps {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  validateStudentNumber: (studentNumber: string) => Promise<boolean>;
  linkStudentToParent: (parentId: string, studentId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        return;
      }

      if (data.session) {
        // In a real app, we would also fetch additional user data like role
        setAuthState({
          user: data.session.user as User,
          session: data.session,
          loading: false,
          error: null,
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signIn({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        toast.error("Failed to log in", {
          description: error.message
        });
        return;
      }

      if (data.user && data.session) {
        setAuthState({
          user: data.user as User,
          session: data.session,
          loading: false,
          error: null,
        });
        
        toast.success("Successfully logged in", {
          description: `Welcome back, ${data.user.email}!`
        });
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      toast.error("An unexpected error occurred", {
        description: error.message
      });
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // For parent signup, validate student number first
      if (credentials.studentNumber) {
        const isValid = await validateStudentNumber(credentials.studentNumber);
        if (!isValid) {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: "Invalid student number. Please check and try again." 
          }));
          toast.error("Invalid student number", {
            description: "Please check the student number and try again."
          });
          return;
        }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            role: 'parent', // Default role for signup
          }
        }
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        toast.error("Failed to sign up", {
          description: error.message
        });
        return;
      }

      setAuthState(prev => ({ ...prev, loading: false }));
      toast.success("Signup successful", {
        description: "Please check your email for verification."
      });
      
      // Link student to parent if student number was provided
      if (data.user && credentials.studentNumber) {
        // Fetch student ID from the student number
        const studentData = await supabase
          .from('Students')
          .select()
          .eq('student_number', credentials.studentNumber);
        
        if (studentData.data && studentData.data.length > 0) {
          await linkStudentToParent(data.user.id, studentData.data[0].id);
        }
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      toast.error("An unexpected error occurred", {
        description: error.message
      });
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
        toast.error("Failed to log out", {
          description: error.message
        });
        return;
      }

      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
      
      toast.success("Successfully logged out");
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      toast.error("An unexpected error occurred", {
        description: error.message
      });
    }
  };

  const validateStudentNumber = async (studentNumber: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('Students')
        .select()
        .eq('student_number', studentNumber);

      if (error) {
        throw error;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error validating student number:', error);
      return false;
    }
  };

  const linkStudentToParent = async (parentId: string, studentId: string): Promise<void> => {
    try {
      // Update the auth.users table to add the student ID to the parent's student_ids array
      const { error } = await supabase
        .from('auth.users')
        .update({ student_ids: [studentId] }) // In a real app, we would append to the existing array
        .eq('id', parentId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error linking student to parent:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ authState, login, signup, logout, validateStudentNumber, linkStudentToParent }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
