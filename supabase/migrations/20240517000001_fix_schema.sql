
-- Add missing columns to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Update existing students to split the name into first_name and last_name
UPDATE public.students 
SET 
  first_name = split_part(name, ' ', 1),
  last_name = CASE 
    WHEN strpos(name, ' ') > 0 THEN substring(name from strpos(name, ' ') + 1)
    ELSE ''
  END
WHERE first_name IS NULL OR last_name IS NULL;

-- Add progress column to student_subjects table
ALTER TABLE public.student_subjects 
ADD COLUMN IF NOT EXISTS progress integer DEFAULT 0;

-- Add some sample progress data
UPDATE public.student_subjects SET progress = floor(random() * 100);
