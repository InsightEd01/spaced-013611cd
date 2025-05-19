
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthState {
  user: any;
  role: string | null;
  schoolId: string | null;
  studentIds: string[] | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType {
  authState: AuthState;
  loading: boolean;
  signup: (params: { email: string; password: string; studentNumber?: string }) => Promise<void>;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  validateStudentNumber: (studentNumber: string) => Promise<boolean>;
}

const initialAuthState: AuthState = {
  user: null,
  role: null,
  schoolId: null,
  studentIds: null,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check
    checkSession();

    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Get the user's role from metadata
          const role = session.user.user_metadata.role;
          setAuthState({
            user: session.user,
            role,
            schoolId: session.user.user_metadata.school_id,
            studentIds: session.user.user_metadata.student_ids,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            role: null,
            schoolId: null,
            studentIds: null,
            loading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Get the user's role from metadata
        const role = session.user.user_metadata.role;
        setAuthState({
          user: session.user,
          role,
          schoolId: session.user.user_metadata.school_id,
          studentIds: session.user.user_metadata.student_ids,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          ...initialAuthState,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setAuthState({
        ...initialAuthState,
        loading: false,
        error: 'Failed to check authentication session',
      });
    }
  };

  const signup = async ({ email, password, studentNumber }: { email: string; password: string; studentNumber?: string }) => {
    try {
      setAuthState(state => ({ ...state, error: null }));
      let metadata = {};
      
      if (studentNumber) {
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id, school_id')
          .eq('student_number', studentNumber)
          .single();

        if (studentError || !student) {
          throw new Error('Invalid student number');
        }
        
        metadata = {
          role: 'parent',
          school_id: student.school_id,
          student_ids: [student.id],
        };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      setAuthState(state => ({ ...state, error: error.message }));
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      setAuthState(state => ({ ...state, error: null }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const role = data.user.user_metadata.role;
      
      // Special handling for supa_admin
      if (role === 'supa_admin') {
        window.location.href = '/admin/dashboard';
        return;
      }
      
      setAuthState({
        user: data.user,
        role,
        schoolId: data.user.user_metadata.school_id,
        studentIds: data.user.user_metadata.student_ids,
        loading: false,
        error: null,
      });
      
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error('Error logging in:', error);
      setAuthState(state => ({ ...state, error: error.message }));
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to login page is handled by auth state change listener
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Failed to log out');
      throw error;
    }
  };

  const validateStudentNumber = async (studentNumber: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .eq('student_number', studentNumber)
        .single();

      if (error) {
        console.error('Error validating student number:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error validating student number:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        loading: authState.loading,
        signup,
        login,
        logout,
        validateStudentNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
