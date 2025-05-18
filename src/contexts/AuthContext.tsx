import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getRole } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  user: any;
  role: string | null;
  schoolId: string | null;
  studentIds: string[] | null;
}

interface AuthContextType {
  authState: AuthState;
  signup: (params: { email: string; password: string; studentNumber?: string }) => Promise<void>;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  validateStudentNumber: (studentNumber: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    schoolId: null,
    studentIds: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check
    checkSession();

    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const role = await getRole();
          setAuthState({
            user: session.user,
            role,
            schoolId: session.user.user_metadata.school_id,
            studentIds: session.user.user_metadata.student_ids,
          });
        } else {
          setAuthState({
            user: null,
            role: null,
            schoolId: null,
            studentIds: null,
          });
        }
        setLoading(false);
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
        const role = await getRole();
        setAuthState({
          user: session.user,
          role,
          schoolId: session.user.user_metadata.school_id,
          studentIds: session.user.user_metadata.student_ids,
        });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ email, password, studentNumber }: { email: string; password: string; studentNumber?: string }) => {
    try {
      let metadata = {};
      
      if (studentNumber) {
        const { data: student } = await supabase
          .from('students')
          .select('id, school_id')
          .eq('student_number', studentNumber)
          .single();

        if (!student) throw new Error('Invalid student number');
        
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
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect based on role
      const role = await getRole();
      switch (role) {
        case 'supa_admin':
          navigate('/admin/dashboard');
          break;
        case 'school_admin':
          navigate('/school/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'parent':
          navigate('/parent/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const validateStudentNumber = async (studentNumber: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('students')
        .select('id')
        .eq('student_number', studentNumber)
        .single();

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
        signup,
        login,
        logout,
        validateStudentNumber,
        loading,
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
