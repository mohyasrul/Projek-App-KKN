import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  encryptData,
  decryptData,
  generateDataHash,
} from "../utils/encryption";
import {
  validateAppData,
  sanitizeData,
  validateDataSize,
} from "../utils/dataValidation";

// Enhanced storage for offline functionality with encryption
const STORAGE_KEY = "kkn-budget-nexus-data";
const STORAGE_VERSION = "1.2.0";

interface StorageData {
  version: string;
  timestamp: number;
  hash: string;
  data: AppState;
}

const saveToStorage = (state: AppState) => {
  try {
    // Validate data size before saving
    if (!validateDataSize(state)) {
      console.error("Data size exceeds limits, not saving");
      return;
    }

    // Sanitize data before saving
    const sanitizedState = sanitizeData(state);

    const dataToSave: StorageData = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      hash: generateDataHash(sanitizedState),
      data: sanitizedState,
    };

    // Encrypt the data before storing
    const encryptedData = encryptData(dataToSave);
    localStorage.setItem(STORAGE_KEY, encryptedData);
    console.log("Data saved to localStorage (encrypted)");
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = (): AppState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    // Try to decrypt the data
    const parsed: StorageData = decryptData(stored);

    // Validate version compatibility
    if (parsed.version === STORAGE_VERSION) {
      // Validate data structure
      if (!validateAppData(parsed.data)) {
        console.error("Stored data validation failed");
        return null;
      }

      // Verify data integrity
      const expectedHash = generateDataHash(parsed.data);
      if (parsed.hash && parsed.hash !== expectedHash) {
        console.warn("Data integrity check failed, data may be corrupted");
        // Still return data but log the warning
      }

      console.log("Data loaded from localStorage (decrypted and validated)");
      return parsed.data;
    }

    // Handle version migration here if needed
    console.log("Storage version mismatch, using defaults");
    return null;
  } catch (error) {
    console.error(
      "Failed to load from localStorage (decryption/validation failed):",
      error
    );
    // If decryption fails, try loading as plain JSON for backward compatibility
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.data && validateAppData(parsed.data)) {
          console.log(
            "Loaded data in legacy format, will be encrypted on next save"
          );
          return parsed.data;
        }
      }
    } catch (legacyError) {
      console.error("Legacy format loading also failed:", legacyError);
    }
    return null;
  }
};

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  category?: string;
  programId?: string;
  receipt?: string;
  createdBy: string;
}

export interface Program {
  id: string;
  name: string;
  allocatedBudget: number;
  usedBudget: number;
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  role: "treasurer" | "member";
  name: string;
}

export interface AppState {
  user: User | null;
  transactions: Transaction[];
  programs: Program[];
  isAuthenticated: boolean;
}

interface AppContextType extends AppState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "createdBy">) => void;
  deleteTransaction: (id: string) => void;
  addProgram: (
    program: Omit<Program, "id" | "usedBudget" | "createdAt">
  ) => void;
  updateProgram: (id: string, updates: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getBalance: () => number;
  getExpensesByProgram: (programId: string) => Transaction[];
  // Security and backup methods
  state: AppState;
  setState: (state: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUsers: User[] = [
  { id: "1", username: "bendahara", role: "treasurer", name: "Bendahara KKN" },
  { id: "2", username: "anggota", role: "member", name: "Anggota KKN" },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>({
    user: null,
    transactions: [],
    programs: [],
    isAuthenticated: false,
  });

  useEffect(() => {
    // Load data from localStorage
    const savedData = loadFromStorage();

    if (savedData) {
      setState((prev) => ({
        ...prev,
        user: savedData.user,
        isAuthenticated: savedData.isAuthenticated || false,
        transactions: savedData.transactions || [],
        programs: savedData.programs || [],
      }));
    }

    // Check for existing authentication
    const authData = localStorage.getItem("kknAuth");
    if (authData && !savedData?.isAuthenticated) {
      try {
        const { user } = JSON.parse(authData);
        setState((prev) => ({ ...prev, user, isAuthenticated: true }));
      } catch (error) {
        console.error("Failed to parse auth data:", error);
        localStorage.removeItem("kknAuth");
      }
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes
    if (
      state.isAuthenticated ||
      state.transactions.length > 0 ||
      state.programs.length > 0
    ) {
      saveToStorage(state);
    }
  }, [state.transactions, state.programs, state.user, state.isAuthenticated]);

  const login = (username: string, password: string): boolean => {
    // Simple authentication - in real app, this would be more secure
    if (password === "password123") {
      const user = defaultUsers.find((u) => u.username === username);
      if (user) {
        setState((prev) => ({ ...prev, user, isAuthenticated: true }));
        localStorage.setItem("kknAuth", JSON.stringify({ user }));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setState((prev) => ({ ...prev, user: null, isAuthenticated: false }));
    localStorage.removeItem("kknAuth");
  };

  const addTransaction = (
    transaction: Omit<Transaction, "id" | "createdBy">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdBy: state.user?.name || "Unknown",
    };

    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));

    // Update program budget if it's an expense with program
    if (transaction.type === "expense" && transaction.programId) {
      setState((prev) => ({
        ...prev,
        programs: prev.programs.map((program) =>
          program.id === transaction.programId
            ? {
                ...program,
                usedBudget: program.usedBudget + transaction.amount,
              }
            : program
        ),
      }));
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = state.transactions.find((t) => t.id === id);

    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));

    // Update program budget if it was an expense with program
    if (transaction?.type === "expense" && transaction.programId) {
      setState((prev) => ({
        ...prev,
        programs: prev.programs.map((program) =>
          program.id === transaction.programId
            ? {
                ...program,
                usedBudget: Math.max(
                  0,
                  program.usedBudget - transaction.amount
                ),
              }
            : program
        ),
      }));
    }
  };

  const addProgram = (
    program: Omit<Program, "id" | "usedBudget" | "createdAt">
  ) => {
    const newProgram: Program = {
      ...program,
      id: Date.now().toString(),
      usedBudget: 0,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      programs: [...prev.programs, newProgram],
    }));
  };

  const updateProgram = (id: string, updates: Partial<Program>) => {
    setState((prev) => ({
      ...prev,
      programs: prev.programs.map((program) =>
        program.id === id ? { ...program, ...updates } : program
      ),
    }));
  };

  const deleteProgram = (id: string) => {
    setState((prev) => ({
      ...prev,
      programs: prev.programs.filter((p) => p.id !== id),
      transactions: prev.transactions.filter((t) => t.programId !== id),
    }));
  };

  const getTotalIncome = () => {
    return state.transactions
      .filter((t) => t.type === "income")
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalExpense = () => {
    return state.transactions
      .filter((t) => t.type === "expense")
      .reduce((total, t) => total + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  const getExpensesByProgram = (programId: string) => {
    return state.transactions.filter(
      (t) => t.type === "expense" && t.programId === programId
    );
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        addTransaction,
        deleteTransaction,
        addProgram,
        updateProgram,
        deleteProgram,
        getTotalIncome,
        getTotalExpense,
        getBalance,
        getExpensesByProgram,
        // Security and backup methods
        state,
        setState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
