// Custom validation utilities
export const validators = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email address';
  },

  password: (value: string) => {
    if (value.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    return true;
  },

  required: (value: string) => {
    return value.trim().length > 0 || 'This field is required';
  },

  phone: (value: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(value) || 'Please enter a valid phone number';
  },

  minLength: (min: number) => (value: string) => {
    return value.length >= min || `Must be at least ${min} characters long`;
  },

  maxLength: (max: number) => (value: string) => {
    return value.length <= max || `Must be no more than ${max} characters long`;
  },
};

export function validateForm(values: Record<string, any>, rules: Record<string, Function[]>) {
  const errors: Record<string, string> = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field] || '';
    
    for (const rule of fieldRules) {
      const result = rule(value);
      if (result !== true) {
        errors[field] = result;
        break; // Stop at first error
      }
    }
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}