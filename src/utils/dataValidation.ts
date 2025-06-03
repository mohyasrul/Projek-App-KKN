import { AppState } from "../contexts/AppContext";

/**
 * Validates the structure and content of app data
 * @param data - Data to validate
 * @returns Boolean indicating if data is valid
 */
export const validateAppData = (data: any): data is AppState => {
  if (!data || typeof data !== "object") {
    return false;
  }
  // Check required top-level properties
  const requiredProperties = [
    "user",
    "transactions",
    "programs",
    "isAuthenticated",
  ];
  for (const prop of requiredProperties) {
    if (!(prop in data)) {
      console.error(`Missing required property: ${prop}`);
      return false;
    }
  }

  // Validate user object
  if (
    data.user !== null &&
    (typeof data.user !== "object" || !data.user.name || !data.user.role)
  ) {
    console.error("Invalid user data structure");
    return false;
  }

  // Validate arrays
  if (!Array.isArray(data.transactions) || !Array.isArray(data.programs)) {
    console.error("Invalid array data structure");
    return false;
  }

  // Validate transaction entries
  for (const transaction of data.transactions) {
    if (
      !transaction.id ||
      !transaction.description ||
      typeof transaction.amount !== "number" ||
      !transaction.date ||
      !transaction.type ||
      !["income", "expense"].includes(transaction.type)
    ) {
      console.error("Invalid transaction entry:", transaction);
      return false;
    }
  }
  // Validate program entries
  for (const program of data.programs) {
    if (
      !program.id ||
      !program.name ||
      typeof program.allocatedBudget !== "number"
    ) {
      console.error("Invalid program entry:", program);
      return false;
    }
  }

  return true;
};

/**
 * Sanitizes data to prevent potential security issues
 * @param data - Data to sanitize
 * @returns Sanitized data
 */
export const sanitizeData = (data: AppState): AppState => {
  return {
    ...data,
    transactions: data.transactions.map((transaction) => ({
      ...transaction,
      description: transaction.description.trim(),
      amount: Math.abs(Number(transaction.amount)) || 0,
      category: transaction.category?.trim() || "",
    })),
    programs: data.programs.map((program) => ({
      ...program,
      name: program.name.trim(),
      description: program.description?.trim() || "",
      allocatedBudget: Math.abs(Number(program.allocatedBudget)) || 0,
      usedBudget: Math.abs(Number(program.usedBudget)) || 0,
    })),
  };
};

/**
 * Validates data format version for migration compatibility
 * @param version - Version string to validate
 * @returns Boolean indicating if version is supported
 */
export const validateDataVersion = (version: string): boolean => {
  const supportedVersions = ["1.0.0", "1.1.0", "1.2.0"];
  return supportedVersions.includes(version);
};

/**
 * Checks if data size is within acceptable limits
 * @param data - Data to check
 * @returns Boolean indicating if size is acceptable
 */
export const validateDataSize = (data: any): boolean => {
  try {
    const jsonString = JSON.stringify(data);
    const sizeInBytes = new Blob([jsonString]).size;
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB limit

    if (sizeInBytes > maxSizeInBytes) {
      console.error(
        `Data size (${sizeInBytes} bytes) exceeds maximum limit (${maxSizeInBytes} bytes)`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to calculate data size:", error);
    return false;
  }
};
