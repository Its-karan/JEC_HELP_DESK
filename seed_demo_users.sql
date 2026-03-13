-- WARNING: Run 'supabase_schema.sql' first!

-- Seed Demo Student Accounts
insert into profiles (name, role, degree, branch, roll_number)
values 
  ('Aarav Sharma', 'student', 'B.Tech', 'Electronics & Communication Engineering (EC)', '0201EC25101'),
  ('Nisha Verma', 'student', 'B.Tech', 'Computer Science & Engineering (CSE)', '0201CS25102');

-- Seed Demo Authority Accounts
insert into profiles (name, role, department, id_identifier)
values 
  ('Mr. Rajesh Kumar', 'employee', 'Hostel & Mess', 'HOSTEL_ADMIN'),
  ('Dr. Anita Singh', 'employee', 'Academics & Exam', 'ACAD_ADMIN'),
  ('Mr. Vikram Patel', 'employee', 'Campus Infrastructure', 'INFRA_ADMIN'),
  ('Dr. Suresh Mehra', 'employee', 'Administration & Accounts', 'ACCOUNTS_ADMIN'),
  ('Dr. Priya Gupta', 'employee', 'IT & Tech Support', 'IT_ADMIN'),
  ('Mr. Amit Shah', 'employee', 'Student Welfare', 'WELFARE_ADMIN'),
  ('Department Head', 'hod', 'Department Head', 'DEPT_HEAD_01'),
  ('Branch HOD', 'hod', 'Branch HOD', 'BRANCH_HOD_01'),
  ('Principal / Apex Authority', 'principal', 'Principal / Apex Authority', 'PRINCIPAL_JEC');

-- NOTE: Since these are profiles, in a real Supabase setup, these would need to be linked to Auth User IDs.
-- For this prototype, we're simulating the login check against these profiles.
