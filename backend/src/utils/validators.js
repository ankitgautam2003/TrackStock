/**
 * Validation utility functions for input sanitization and type checking
 */

/**
 * Validates and parses a positive integer
 * @param {*} value - The value to validate
 * @param {string} fieldName - The field name for error messages
 * @returns {number} - Parsed positive integer
 * @throws {Error} - If validation fails
 */
export function validatePositiveInteger(value, fieldName) {
  // Check if value is provided
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }

  const parsed = parseInt(value);
  
  // Check for NaN
  if (isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  // Check if it's actually an integer (not a float)
  if (!Number.isInteger(parseFloat(value))) {
    throw new Error(`${fieldName} must be an integer`);
  }
  
  // Check if positive
  if (parsed <= 0) {
    throw new Error(`${fieldName} must be greater than 0`);
  }
  
  // Check for safe integer range
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${fieldName} is too large`);
  }
  
  return parsed;
}

/**
 * Validates and parses a positive number (can be decimal)
 * @param {*} value - The value to validate
 * @param {string} fieldName - The field name for error messages
 * @returns {number} - Parsed positive number
 * @throws {Error} - If validation fails
 */
export function validatePositiveNumber(value, fieldName) {
  // Check if value is provided
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }

  const parsed = parseFloat(value);
  
  // Check for NaN
  if (isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  // Check if positive or zero
  if (parsed < 0) {
    throw new Error(`${fieldName} must be 0 or greater`);
  }
  
  // Check for safe number range
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} is not a valid number`);
  }
  
  return parsed;
}

/**
 * Validates and sanitizes a non-empty string
 * @param {*} value - The value to validate
 * @param {string} fieldName - The field name for error messages
 * @returns {string} - Trimmed string
 * @throws {Error} - If validation fails
 */
export function validateNonEmptyString(value, fieldName) {
  // Check if value exists and is a string
  if (value === undefined || value === null) {
    throw new Error(`${fieldName} is required`);
  }
  
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  const trimmed = value.trim();
  
  // Check if empty after trimming
  if (!trimmed) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  
  return trimmed;
}

/**
 * Validates and normalizes a SKU (converts to uppercase, trims)
 * @param {*} value - The SKU value to validate
 * @returns {string} - Normalized SKU
 * @throws {Error} - If validation fails
 */
export function validateSKU(value) {
  const trimmed = validateNonEmptyString(value, 'SKU');
  
  // Normalize to uppercase for consistency
  return trimmed.toUpperCase();
}

/**
 * Validates a non-negative integer (allows 0)
 * @param {*} value - The value to validate
 * @param {string} fieldName - The field name for error messages
 * @returns {number} - Parsed non-negative integer
 * @throws {Error} - If validation fails
 */
export function validateNonNegativeInteger(value, fieldName) {
  // Allow undefined/null to return 0 as default
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  const parsed = parseInt(value);
  
  // Check for NaN
  if (isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  // Check if it's actually an integer
  if (!Number.isInteger(parseFloat(value))) {
    throw new Error(`${fieldName} must be an integer`);
  }
  
  // Check if non-negative
  if (parsed < 0) {
    throw new Error(`${fieldName} cannot be negative`);
  }
  
  // Check for safe integer range
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${fieldName} is too large`);
  }
  
  return parsed;
}
