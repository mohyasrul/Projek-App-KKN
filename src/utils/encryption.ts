import CryptoJS from "crypto-js";

// Secure encryption key - in production, this should be environment-specific
const ENCRYPTION_KEY = "KKN-SINGHEMAT-SECURE-KEY-2025";

/**
 * Encrypts data using AES encryption
 * @param data - Data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(
      jsonString,
      ENCRYPTION_KEY
    ).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
};

/**
 * Decrypts data using AES decryption
 * @param encryptedData - Encrypted string to decrypt
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: string): any => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error("Invalid encryption key or corrupted data");
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
};

/**
 * Generates a hash of the data for integrity checking
 * @param data - Data to hash
 * @returns SHA256 hash string
 */
export const generateDataHash = (data: any): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.SHA256(jsonString).toString();
};

/**
 * Verifies data integrity using hash comparison
 * @param data - Data to verify
 * @param expectedHash - Expected hash value
 * @returns Boolean indicating if data is valid
 */
export const verifyDataIntegrity = (
  data: any,
  expectedHash: string
): boolean => {
  try {
    const currentHash = generateDataHash(data);
    return currentHash === expectedHash;
  } catch (error) {
    console.error("Data verification failed:", error);
    return false;
  }
};
