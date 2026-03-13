export type UserRole = 'student' | 'employee' | 'hod' | 'principal';

export type DegreeProgram = 'B.Tech' | 'M.Tech' | 'MCA' | 'M.Sc.' | 'Ph.D.';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  branch?: string;
  degree?: DegreeProgram;
  department?: string;
  rollNumber?: string;
  employeeId?: string;
}

export type ComplaintCategory = 'Hostel & Mess' | 'Academics & Exam' | 'Campus Infrastructure' | 'Administration & Accounts' | 'IT & Tech Support' | 'Student Welfare';
export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';
export type UrgencyLevel = 'Low' | 'Medium' | 'High';

export const SUB_CATEGORIES: Record<ComplaintCategory, readonly string[]> = {
  'Hostel & Mess': ['Room Maintenance', 'Water & Plumbing', 'Electricity & Fan', 'Mess Food Quality', 'Hostel Wi-Fi Issue', 'Washroom Cleanliness', 'Security/Theft Report'],
  'Academics & Exam': ['Marks Update Delay', 'Attendance Discrepancy', 'Exam Form Issue', 'Timetable Clash', 'Library Book Unavailability', 'Result Correction'],
  'Campus Infrastructure': ['Classroom Furniture Broken', 'Lab Equipment Fault', 'Water Cooler Issue', 'Campus Wi-Fi Down', 'Street Lights/Dark Areas', 'Parking Issue'],
  'Administration & Accounts': ['Fee Payment Issue', 'Scholarship Query', 'ID Card Correction', 'Migration/TC Request', 'Railway Concession Form', 'Sambal Card Issue'],
  'IT & Tech Support': ['ERP Login Issue', 'Student Portal Glitch', 'Official Email Password Reset'],
  'Student Welfare': ['Sports Equipment Needed', 'Club Event Permission', 'Medical/First-Aid Issue', 'Anti-Ragging / Harassment'],
};

// Auto-urgent sub-categories
export const URGENT_SUB_CATEGORIES = ['Electricity & Fan', 'Water & Plumbing', 'Security/Theft Report', 'Medical/First-Aid Issue', 'Anti-Ragging / Harassment'];

export interface AdminComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  subCategory?: string;
  targetDepartment: string;
  branch: string;
  degree?: DegreeProgram;
  studentId: string;
  studentName: string;
  urgency: UrgencyLevel;
  status: ComplaintStatus;
  authorityLevel: number;
  imageUrl?: string;
  resolutionProofUrl?: string;
  expectedDate?: string;
  adminComments: AdminComment[];
  createdAt: string;
  resolvedAt?: string;
}

export const DEGREE_PROGRAMS: DegreeProgram[] = ['B.Tech', 'M.Tech', 'MCA', 'M.Sc.', 'Ph.D.'];

export const DEGREE_BRANCHES: Record<DegreeProgram, string[]> = {
  'B.Tech': [
    'Electronics & Communication Engineering (EC)',
    'Computer Science & Engineering (CSE)',
    'Information Technology (IT)',
    'Artificial Intelligence & Data Science (AI & DS)',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Industrial & Production Engineering (IP)',
    'Mechatronics Engineering',
  ],
  'M.Tech': [
    'Communication Systems',
    'Microwave Engineering',
    'Control Systems',
    'High Voltage and Power System Engineering',
    'Environmental Engineering',
    'Geotechnical Engineering',
    'Structural Engineering',
    'Machine Design',
    'Heat Power Engineering',
  ],
  'MCA': [
    'Master of Computer Applications (MCA - General)',
  ],
  'M.Sc.': [
    'Applied Physics',
    'Applied Chemistry',
    'Applied Mathematics',
  ],
  'Ph.D.': [
    'Core Engineering & Applied Sciences',
  ],
};

// Keep legacy BRANCHES for backward compat
export const BRANCHES = DEGREE_BRANCHES['B.Tech'];

export const BRANCH_SHORT: Record<string, string> = {
  'Electronics & Communication Engineering (EC)': 'EC',
  'Electronics and Communication Engineering (EC)': 'EC',
  'Civil Engineering': 'CE',
  'Mechanical Engineering': 'ME',
  'Electrical Engineering': 'EE',
  'Computer Science & Engineering (CSE)': 'CSE',
  'Computer Science and Engineering': 'CSE',
  'Information Technology (IT)': 'IT',
  'Information Technology': 'IT',
  'Industrial & Production Engineering (IP)': 'IP',
  'Industrial and Production Engineering': 'IPE',
  'Artificial Intelligence & Data Science (AI & DS)': 'AI&DS',
  'Artificial Intelligence and Data Science': 'AI&DS',
  'Mechatronics Engineering': 'Mech',
  'Communication Systems': 'CS',
  'Microwave Engineering': 'MW',
  'Control Systems': 'CtrlS',
  'High Voltage and Power System Engineering': 'HVPS',
  'Environmental Engineering': 'EnvE',
  'Geotechnical Engineering': 'GeoE',
  'Structural Engineering': 'SE',
  'Machine Design': 'MD',
  'Heat Power Engineering': 'HPE',
  'Master of Computer Applications (MCA - General)': 'MCA',
  'Applied Physics': 'Phy',
  'Applied Chemistry': 'Chem',
  'Applied Mathematics': 'Math',
  'Core Engineering & Applied Sciences': 'PhD',
};

export const DEPARTMENTS = ['Hostel & Mess', 'Academics & Exam', 'Campus Infrastructure', 'Administration & Accounts', 'IT & Tech Support', 'Student Welfare'] as const;
export const CATEGORIES: ComplaintCategory[] = ['Hostel & Mess', 'Academics & Exam', 'Campus Infrastructure', 'Administration & Accounts', 'IT & Tech Support', 'Student Welfare'];

export const CATEGORY_COLORS: Record<ComplaintCategory, { bg: string; text: string }> = {
  'Hostel & Mess': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  'Academics & Exam': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  'Campus Infrastructure': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  'Administration & Accounts': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  'IT & Tech Support': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
  'Student Welfare': { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300' },
};

export const ESCALATION_LABELS: Record<number, string> = {
  1: 'Assigned Employee',
  2: 'Employee + Department Head',
  3: 'Employee + Head + Branch HOD',
  4: 'Full Committee + Principal, JEC',
};

export function getAuthoritiesInformed(level: number, department: string, branch?: string): string {
  const branchShort = branch ? (BRANCH_SHORT[branch] || branch) : '';
  const hodLabel = branch && (branch.includes('EC') || branch.includes('Electronics'))
    ? 'HOD of EC Department (Electronics & Communication)'
    : `${branchShort} HOD`;

  switch (level) {
    case 1: return 'Assigned Employee';
    case 2: return `Employee + Head of ${department}`;
    case 3: return `Employee + Head of ${department} + ${hodLabel}`;
    case 4: return `Employee + Head of ${department} + ${hodLabel} + Principal, JEC`;
    default: return 'Assigned Employee';
  }
}
