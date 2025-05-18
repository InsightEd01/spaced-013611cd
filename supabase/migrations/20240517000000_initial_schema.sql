-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Add custom columns to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS student_ids uuid[];
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS school_id uuid;

-- Create schools table
CREATE TABLE IF NOT EXISTS public.schools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    region text NOT NULL,
    subscription_plan text CHECK (subscription_plan IN ('basic', 'premium')) DEFAULT 'basic',
    created_at timestamptz DEFAULT now(),
    supa_admin_id uuid REFERENCES auth.users(id)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid REFERENCES public.schools(id),
    plan text NOT NULL,
    status text CHECK (status IN ('active', 'expired', 'suspended')) DEFAULT 'active',
    renewal_date date NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    action text NOT NULL,
    supa_admin_id uuid REFERENCES auth.users(id),
    target_school_id uuid REFERENCES public.schools(id),
    timestamp timestamptz DEFAULT now(),
    details jsonb
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    name text NOT NULL,
    school_id uuid REFERENCES public.schools(id),
    created_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name text NOT NULL,
    school_id uuid REFERENCES public.schools(id),
    created_at timestamptz DEFAULT now()
);

-- Create class_teachers junction table
CREATE TABLE IF NOT EXISTS public.class_teachers (
    class_id uuid REFERENCES public.classes(id),
    teacher_id uuid REFERENCES public.teachers(id),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (class_id, teacher_id)
);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_number char(10) UNIQUE NOT NULL,
    name text NOT NULL,
    class_id uuid REFERENCES public.classes(id),
    school_id uuid REFERENCES public.schools(id),
    created_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_name text NOT NULL,
    school_id uuid REFERENCES public.schools(id),
    created_at timestamptz DEFAULT now()
);

-- Create student_subjects junction table
CREATE TABLE IF NOT EXISTS public.student_subjects (
    student_id uuid REFERENCES public.students(id),
    subject_id uuid REFERENCES public.subjects(id),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (student_id, subject_id)
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id uuid REFERENCES public.subjects(id),
    assessment_type text CHECK (assessment_type IN ('test', 'exam')),
    assessment_name text NOT NULL,
    date date NOT NULL,
    max_score integer NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create assessment_scores table
CREATE TABLE IF NOT EXISTS public.assessment_scores (
    assessment_id uuid REFERENCES public.assessments(id),
    student_id uuid REFERENCES public.students(id),
    score integer NOT NULL,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (assessment_id, student_id)
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id uuid REFERENCES public.teachers(id),
    class_id uuid REFERENCES public.classes(id),
    title text NOT NULL,
    content text NOT NULL,
    date date NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES public.students(id),
    class_id uuid REFERENCES public.classes(id),
    date date NOT NULL,
    status text CHECK (status IN ('present', 'absent', 'late')),
    created_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES public.students(id),
    type text CHECK (type IN ('complaint', 'suggestion')),
    content text NOT NULL,
    date date DEFAULT CURRENT_DATE,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Supa Admin policies
CREATE POLICY "Supa Admin full access" ON public.schools
    FOR ALL USING (auth.jwt() ->> 'role' = 'supa_admin');

CREATE POLICY "Supa Admin full access" ON public.subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'supa_admin');

CREATE POLICY "Supa Admin full access" ON public.audit_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'supa_admin');

-- School Admin policies
CREATE POLICY "School Admin access own school" ON public.schools
    FOR SELECT USING (id = auth.jwt() ->> 'school_id');

CREATE POLICY "School Admin manage teachers" ON public.teachers
    FOR ALL USING (school_id = auth.jwt() ->> 'school_id' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "School Admin manage classes" ON public.classes
    FOR ALL USING (school_id = auth.jwt() ->> 'school_id' AND auth.jwt() ->> 'role' = 'admin');

-- Teacher policies
CREATE POLICY "Teachers view own school" ON public.schools
    FOR SELECT USING (id = auth.jwt() ->> 'school_id');

CREATE POLICY "Teachers view assigned classes" ON public.classes
    FOR SELECT USING (
        id IN (
            SELECT class_id 
            FROM public.class_teachers 
            WHERE teacher_id = (
                SELECT id FROM public.teachers WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Teachers manage announcements" ON public.announcements
    FOR ALL USING (
        teacher_id = (SELECT id FROM public.teachers WHERE user_id = auth.uid())
    );

CREATE POLICY "Teachers manage attendance" ON public.attendance
    FOR ALL USING (
        class_id IN (
            SELECT class_id 
            FROM public.class_teachers 
            WHERE teacher_id = (
                SELECT id FROM public.teachers WHERE user_id = auth.uid()
            )
        )
    );

-- Parent policies
CREATE POLICY "Parents view student data" ON public.students
    FOR SELECT USING (
        id = ANY(COALESCE((auth.jwt() ->> 'student_ids')::uuid[], '{}'))
    );

CREATE POLICY "Parents view announcements" ON public.announcements
    FOR SELECT USING (
        class_id IN (
            SELECT class_id 
            FROM public.students 
            WHERE id = ANY(COALESCE((auth.jwt() ->> 'student_ids')::uuid[], '{}'))
        )
    );

CREATE POLICY "Parents view attendance" ON public.attendance
    FOR SELECT USING (
        student_id = ANY(COALESCE((auth.jwt() ->> 'student_ids')::uuid[], '{}'))
    );

CREATE POLICY "Parents manage feedback" ON public.feedback
    FOR INSERT USING (
        student_id = ANY(COALESCE((auth.jwt() ->> 'student_ids')::uuid[], '{}'))
    );
