import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Data Types
export interface Student {
  id: string;
  nim: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  faculty: string;
  major: string;
  semester: number;
  gpa: number;
  skills: string[];
  interests: string[];
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: "active" | "inactive" | "completed" | "dropped";
  joinDate: string;
  program?: string;
  position?:
    | "coordinator"
    | "vice_coordinator"
    | "secretary"
    | "treasurer"
    | "member";
  mentor?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "planned" | "ongoing" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  location: string;
  coordinator: string;
  participants: string[];
  budget: number;
  usedBudget: number;
  objectives: string;
  results?: string;
  images?: string[];
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  type:
    | "desa"
    | "balai"
    | "sekolah"
    | "puskesmas"
    | "masjid"
    | "lapangan"
    | "kantor"
    | "lainnya";
  address: string;
  village: string;
  district: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  capacity: number;
  facilities: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  availability: "available" | "busy" | "maintenance" | "unavailable";
  operatingHours: {
    start: string;
    end: string;
  };
  description: string;
  images?: string[];
  rating: number;
  totalActivities: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  type: "chat" | "announcement" | "urgent";
  title?: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  recipients: string[];
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  timestamp: string;
  isRead: boolean;
  isPinned: boolean;
  priority: "low" | "normal" | "high" | "urgent";
  replies?: Message[];
  readBy: string[];
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  receiptNumber?: string;
  attachments?: string[];
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  receiptNumber?: string;
  attachments?: string[];
  status: "pending" | "approved" | "rejected" | "paid";
  approvedBy?: string;
  paymentMethod?: string;
  vendor?: string;
  activityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  coordinator: string;
  startDate: string;
  endDate: string;
  budget: number;
  usedBudget: number;
  participants: string[];
  activities: string[];
  status: "planning" | "active" | "completed" | "cancelled";
  objectives: string[];
  results?: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
}

// Storage Keys
const STORAGE_KEYS = {
  STUDENTS: "kkn_students",
  ACTIVITIES: "kkn_activities",
  LOCATIONS: "kkn_locations",
  MESSAGES: "kkn_messages",
  INCOMES: "kkn_incomes",
  EXPENSES: "kkn_expenses",
  PROGRAMS: "kkn_programs",
  SETTINGS: "kkn_settings",
  LAST_BACKUP: "kkn_last_backup",
} as const;

// Context Types
interface DataContextType {
  // Students
  students: Student[];
  addStudent: (
    student: Omit<Student, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudent: (id: string) => Student | undefined;

  // Activities
  activities: Activity[];
  addActivity: (
    activity: Omit<Activity, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  getActivity: (id: string) => Activity | undefined;

  // Locations
  locations: Location[];
  addLocation: (
    location: Omit<Location, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  getLocation: (id: string) => Location | undefined;

  // Messages
  messages: Message[];
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  getMessage: (id: string) => Message | undefined;

  // Incomes
  incomes: Income[];
  addIncome: (income: Omit<Income, "id" | "createdAt" | "updatedAt">) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  getIncome: (id: string) => Income | undefined;

  // Expenses
  expenses: Expense[];
  addExpense: (
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpense: (id: string) => Expense | undefined;

  // Programs
  programs: Program[];
  addProgram: (
    program: Omit<Program, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  getProgram: (id: string) => Program | undefined;

  // Utility functions
  exportAllData: () => Record<string, any>;
  importAllData: (data: Record<string, any>) => void;
  clearAllData: () => void;
  getLastBackup: () => string | null;
  setLastBackup: (timestamp: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to generate unique IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to get current timestamp
const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Sample data initialization
const createSampleStudents = (): Student[] => [
  {
    id: generateId(),
    nim: "2021001001",
    name: "Ahmad Rizki Pratama",
    email: "ahmad.rizki@university.ac.id",
    phone: "+6281234567890",
    university: "Universitas Brawijaya",
    faculty: "Fakultas Ilmu Komputer",
    major: "Teknik Informatika",
    semester: 6,
    gpa: 3.75,
    skills: ["JavaScript", "React", "Node.js", "Database"],
    interests: ["Web Development", "Mobile Apps", "AI"],
    address: "Jl. Veteran No. 123, Malang, Jawa Timur",
    emergencyContact: {
      name: "Siti Pratama",
      relationship: "Ibu",
      phone: "+6281234567891",
    },
    status: "active",
    joinDate: "2024-01-15",
    program: "KKN Thematik Desa Digital",
    position: "coordinator",
    avatar: "",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    nim: "2021001002",
    name: "Sari Dewi Lestari",
    email: "sari.dewi@university.ac.id",
    phone: "+6281234567892",
    university: "Universitas Brawijaya",
    faculty: "Fakultas Ekonomi dan Bisnis",
    major: "Manajemen",
    semester: 6,
    gpa: 3.85,
    skills: ["Project Management", "Financial Analysis", "Leadership"],
    interests: [
      "Business Development",
      "Community Empowerment",
      "Social Innovation",
    ],
    address: "Jl. Soekarno Hatta No. 456, Malang, Jawa Timur",
    emergencyContact: {
      name: "Budi Lestari",
      relationship: "Ayah",
      phone: "+6281234567893",
    },
    status: "active",
    joinDate: "2024-01-15",
    program: "KKN Thematik Desa Digital",
    position: "vice_coordinator",
    avatar: "",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    nim: "2021001003",
    name: "Muhammad Fajar Sidiq",
    email: "fajar.sidiq@university.ac.id",
    phone: "+6281234567894",
    university: "Universitas Brawijaya",
    faculty: "Fakultas Pertanian",
    major: "Agribisnis",
    semester: 6,
    gpa: 3.65,
    skills: ["Agricultural Technology", "Data Analysis", "Community Outreach"],
    interests: [
      "Sustainable Agriculture",
      "Rural Development",
      "Technology Transfer",
    ],
    address: "Jl. Diponegoro No. 789, Malang, Jawa Timur",
    emergencyContact: {
      name: "Aminah Sidiq",
      relationship: "Ibu",
      phone: "+6281234567895",
    },
    status: "active",
    joinDate: "2024-01-15",
    program: "KKN Thematik Desa Digital",
    position: "secretary",
    avatar: "",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    nim: "2021001004",
    name: "Nurul Aisyah Putri",
    email: "nurul.aisyah@university.ac.id",
    phone: "+6281234567896",
    university: "Universitas Brawijaya",
    faculty: "Fakultas Ilmu Sosial dan Ilmu Politik",
    major: "Ilmu Komunikasi",
    semester: 6,
    gpa: 3.8,
    skills: [
      "Communication",
      "Social Media",
      "Content Creation",
      "Public Relations",
    ],
    interests: ["Digital Marketing", "Community Media", "Social Campaigns"],
    address: "Jl. Kawi No. 321, Malang, Jawa Timur",
    emergencyContact: {
      name: "Ahmad Putri",
      relationship: "Ayah",
      phone: "+6281234567897",
    },
    status: "active",
    joinDate: "2024-01-15",
    program: "KKN Thematik Desa Digital",
    position: "member",
    avatar: "",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    nim: "2021001005",
    name: "Bayu Adi Nugroho",
    email: "bayu.adi@university.ac.id",
    phone: "+6281234567898",
    university: "Universitas Brawijaya",
    faculty: "Fakultas Teknik",
    major: "Teknik Sipil",
    semester: 6,
    gpa: 3.7,
    skills: [
      "Engineering",
      "Project Planning",
      "CAD Software",
      "Construction Management",
    ],
    interests: [
      "Infrastructure Development",
      "Green Building",
      "Urban Planning",
    ],
    address: "Jl. Semeru No. 654, Malang, Jawa Timur",
    emergencyContact: {
      name: "Sri Nugroho",
      relationship: "Ibu",
      phone: "+6281234567899",
    },
    status: "active",
    joinDate: "2024-01-15",
    program: "KKN Thematik Desa Digital",
    position: "member",
    avatar: "",
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
];

// Data Provider Component
export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize all data stores with localStorage
  const [students, setStudents] = useLocalStorage<Student[]>(
    STORAGE_KEYS.STUDENTS,
    []
  );
  const [activities, setActivities] = useLocalStorage<Activity[]>(
    STORAGE_KEYS.ACTIVITIES,
    []
  );
  const [locations, setLocations] = useLocalStorage<Location[]>(
    STORAGE_KEYS.LOCATIONS,
    []
  );
  const [messages, setMessages] = useLocalStorage<Message[]>(
    STORAGE_KEYS.MESSAGES,
    []
  );
  const [incomes, setIncomes] = useLocalStorage<Income[]>(
    STORAGE_KEYS.INCOMES,
    []
  );
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(
    STORAGE_KEYS.EXPENSES,
    []
  );
  const [programs, setPrograms] = useLocalStorage<Program[]>(
    STORAGE_KEYS.PROGRAMS,
    []
  );
  const [lastBackup, setLastBackupStorage] = useLocalStorage<string | null>(
    STORAGE_KEYS.LAST_BACKUP,
    null
  );

  // Student operations
  const addStudent = (
    studentData: Omit<Student, "id" | "createdAt" | "updatedAt">
  ) => {
    const newStudent: Student = {
      ...studentData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, ...studentData, updatedAt: getCurrentTimestamp() }
          : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const getStudent = (id: string) => {
    return students.find((student) => student.id === id);
  };

  // Activity operations
  const addActivity = (
    activityData: Omit<Activity, "id" | "createdAt" | "updatedAt">
  ) => {
    const newActivity: Activity = {
      ...activityData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    setActivities((prev) => [...prev, newActivity]);
  };

  const updateActivity = (id: string, activityData: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id
          ? { ...activity, ...activityData, updatedAt: getCurrentTimestamp() }
          : activity
      )
    );
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  };

  const getActivity = (id: string) => {
    return activities.find((activity) => activity.id === id);
  };

  // Location operations
  const addLocation = (
    locationData: Omit<Location, "id" | "createdAt" | "updatedAt">
  ) => {
    const newLocation: Location = {
      ...locationData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    setLocations((prev) => [...prev, newLocation]);
  };

  const updateLocation = (id: string, locationData: Partial<Location>) => {
    setLocations((prev) =>
      prev.map((location) =>
        location.id === id
          ? { ...location, ...locationData, updatedAt: getCurrentTimestamp() }
          : location
      )
    );
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((location) => location.id !== id));
  };

  const getLocation = (id: string) => {
    return locations.find((location) => location.id === id);
  };

  // Message operations
  const addMessage = (messageData: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...messageData,
      id: generateId(),
      timestamp: getCurrentTimestamp(),
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const updateMessage = (id: string, messageData: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, ...messageData } : message
      )
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const getMessage = (id: string) => {
    return messages.find((message) => message.id === id);
  };

  // Income operations
  const addIncome = (
    incomeData: Omit<Income, "id" | "createdAt" | "updatedAt">
  ) => {
    const newIncome: Income = {
      ...incomeData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    setIncomes((prev) => [...prev, newIncome]);
  };

  const updateIncome = (id: string, incomeData: Partial<Income>) => {
    setIncomes((prev) =>
      prev.map((income) =>
        income.id === id
          ? { ...income, ...incomeData, updatedAt: getCurrentTimestamp() }
          : income
      )
    );
  };

  const deleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((income) => income.id !== id));
  };

  const getIncome = (id: string) => {
    return incomes.find((income) => income.id === id);
  };

  // Expense operations
  const addExpense = (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? { ...expense, ...expenseData, updatedAt: getCurrentTimestamp() }
          : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const getExpense = (id: string) => {
    return expenses.find((expense) => expense.id === id);
  };

  // Program operations
  const addProgram = (
    programData: Omit<Program, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProgram: Program = {
      ...programData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    setPrograms((prev) => [...prev, newProgram]);
  };

  const updateProgram = (id: string, programData: Partial<Program>) => {
    setPrograms((prev) =>
      prev.map((program) =>
        program.id === id
          ? { ...program, ...programData, updatedAt: getCurrentTimestamp() }
          : program
      )
    );
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((program) => program.id !== id));
  };

  const getProgram = (id: string) => {
    return programs.find((program) => program.id === id);
  };

  // Utility functions
  const exportAllData = () => {
    return {
      [STORAGE_KEYS.STUDENTS]: students,
      [STORAGE_KEYS.ACTIVITIES]: activities,
      [STORAGE_KEYS.LOCATIONS]: locations,
      [STORAGE_KEYS.MESSAGES]: messages,
      [STORAGE_KEYS.INCOMES]: incomes,
      [STORAGE_KEYS.EXPENSES]: expenses,
      [STORAGE_KEYS.PROGRAMS]: programs,
      exportTimestamp: getCurrentTimestamp(),
    };
  };

  const importAllData = (data: Record<string, any>) => {
    if (data[STORAGE_KEYS.STUDENTS]) setStudents(data[STORAGE_KEYS.STUDENTS]);
    if (data[STORAGE_KEYS.ACTIVITIES])
      setActivities(data[STORAGE_KEYS.ACTIVITIES]);
    if (data[STORAGE_KEYS.LOCATIONS])
      setLocations(data[STORAGE_KEYS.LOCATIONS]);
    if (data[STORAGE_KEYS.MESSAGES]) setMessages(data[STORAGE_KEYS.MESSAGES]);
    if (data[STORAGE_KEYS.INCOMES]) setIncomes(data[STORAGE_KEYS.INCOMES]);
    if (data[STORAGE_KEYS.EXPENSES]) setExpenses(data[STORAGE_KEYS.EXPENSES]);
    if (data[STORAGE_KEYS.PROGRAMS]) setPrograms(data[STORAGE_KEYS.PROGRAMS]);
  };

  const clearAllData = () => {
    setStudents([]);
    setActivities([]);
    setLocations([]);
    setMessages([]);
    setIncomes([]);
    setExpenses([]);
    setPrograms([]);
    setLastBackupStorage(null);
  };

  const getLastBackup = () => lastBackup;
  const setLastBackup = (timestamp: string) => setLastBackupStorage(timestamp);

  const value: DataContextType = {
    // Students
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,

    // Activities
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivity,

    // Locations
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocation,

    // Messages
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    getMessage,

    // Incomes
    incomes,
    addIncome,
    updateIncome,
    deleteIncome,
    getIncome,

    // Expenses
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,

    // Programs
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    getProgram,

    // Utilities
    exportAllData,
    importAllData,
    clearAllData,
    getLastBackup,
    setLastBackup,
  };
  // Initialize sample data if storage is empty
  if (students.length === 0) {
    setStudents(createSampleStudents());
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// Export storage keys for direct access if needed
export { STORAGE_KEYS };
