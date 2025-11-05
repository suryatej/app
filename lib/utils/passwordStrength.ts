// Password Strength Utility

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordRequirement {
  label: string;
  met: boolean;
  regex?: RegExp;
}

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string;
  percentage: number; // 0-100 for progress bar
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  let feedback = '';

  // Check password length
  if (password.length === 0) {
    return {
      strength: 'weak',
      score: 0,
      feedback: 'Enter a password',
      percentage: 0,
    };
  }

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Check for lowercase letters
  if (/[a-z]/.test(password)) score++;

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) score++;

  // Check for numbers
  if (/[0-9]/.test(password)) score++;

  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Check for common patterns (reduce score)
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^abc123/i,
    /^111111/,
    /^12345678/,
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    score = Math.max(0, score - 2);
  }

  // Determine strength and feedback
  let strength: PasswordStrength;
  
  if (score <= 2) {
    strength = 'weak';
    feedback = 'Weak password - add more variety';
  } else if (score === 3) {
    strength = 'fair';
    feedback = 'Fair password - could be stronger';
  } else if (score === 4) {
    strength = 'good';
    feedback = 'Good password';
  } else {
    strength = 'strong';
    feedback = 'Strong password!';
  }

  // Calculate percentage (map score 0-6 to 0-100)
  const percentage = Math.min(100, Math.round((score / 6) * 100));

  return {
    strength,
    score,
    feedback,
    percentage,
  };
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      label: 'At least 8 characters long',
      met: password.length >= 8,
      regex: /.{8,}/,
    },
    {
      label: 'Contains lowercase letter (a-z)',
      met: /[a-z]/.test(password),
      regex: /[a-z]/,
    },
    {
      label: 'Contains uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
      regex: /[A-Z]/,
    },
    {
      label: 'Contains number (0-9)',
      met: /[0-9]/.test(password),
      regex: /[0-9]/,
    },
    {
      label: 'Contains special character (!@#$%^&*)',
      met: /[^A-Za-z0-9]/.test(password),
      regex: /[^A-Za-z0-9]/,
    },
  ];
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  const colors: Record<PasswordStrength, string> = {
    weak: 'bg-red-500',
    fair: 'bg-yellow-500',
    good: 'bg-blue-500',
    strong: 'bg-green-500',
  };
  
  return colors[strength];
}

export function getPasswordStrengthTextColor(strength: PasswordStrength): string {
  const colors: Record<PasswordStrength, string> = {
    weak: 'text-red-600 dark:text-red-400',
    fair: 'text-yellow-600 dark:text-yellow-400',
    good: 'text-blue-600 dark:text-blue-400',
    strong: 'text-green-600 dark:text-green-400',
  };
  
  return colors[strength];
}
