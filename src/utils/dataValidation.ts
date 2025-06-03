import { AppState } from '../contexts/AppContext';

/**
 * Validates the structure and content of app data
 * @param data - Data to validate
 * @returns Boolean indicating if data is valid
 */
export const validateAppData = (data: any): data is AppState => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check required top-level properties
  const requiredProperties = ['user', 'incomes', 'expenses', 'programs', 'isAuthenticated'];
  for (const prop of requiredProperties) {
    if (!(prop in data)) {
      console.error(`Missing required property: ${prop}`);
      return false;
    }
  }

  // Validate user object
  if (data.user !== null && (typeof data.user !== 'object' || !data.user.name || !data.user.role)) {
    console.error('Invalid user data structure');
    return false;
  }

  // Validate arrays
  if (!Array.isArray(data.incomes) || !Array.isArray(data.expenses) || !Array.isArray(data.programs)) {
    console.error('Invalid array data structure');
    return false;
  }

  // Validate income entries
  for (const income of data.incomes) {
    if (!income.id || !income.source || typeof income.amount !== 'number' || !income.date) {
      console.error('Invalid income entry:', income);
      return false;
    }
  }

  // Validate expense entries
  for (const expense of data.expenses) {
    if (!expense.id || !expense.description || typeof expense.amount !== 'number' || !expense.date) {
      console.error('Invalid expense entry:', expense);
      return false;
    }
  }

  // Validate program entries
  for (const program of data.programs) {
    if (!program.id || !program.name || typeof program.budget !== 'number') {
      console.error('Invalid program entry:', program);
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
    incomes: data.incomes.map(income => ({
      ...income,
      source: income.source.trim(),
      description: income.description?.trim() || '',
      amount: Math.abs(Number(income.amount)) || 0
    })),
    expenses: data.expenses.map(expense => ({
      ...expense,
      description: expense.description.trim(),
      amount: Math.abs(Number(expense.amount)) || 0
    })),
    programs: data.programs.map(program => ({
      ...program,
      name: program.name.trim(),
      description: program.description?.trim() || '',
      budget: Math.abs(Number(program.budget)) || 0
    }))
  };
};

/**
 * Validates data format version for migration compatibility
 * @param version - Version string to validate
 * @returns Boolean indicating if version is supported
 */
export const validateDataVersion = (version: string): boolean => {
  const supportedVersions = ['1.0.0', '1.1.0', '1.2.0'];
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
      console.error(`Data size (${sizeInBytes} bytes) exceeds maximum limit (${maxSizeInBytes} bytes)`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to calculate data size:', error);
    return false;
  }
};
