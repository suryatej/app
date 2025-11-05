'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormData } from '@/lib/schemas/loginSchema';
import { loginWithEmail } from '@/lib/api/authApi';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const useLoginForm = () => {
  const router = useRouter();
  const { login, setLoading, setError } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Update a single field
  const updateField = useCallback((field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [errors]);

  // Mark field as touched
  const handleBlur = useCallback((field: keyof LoginFormData) => {
    setTouchedFields((prev) => new Set(prev).add(field));
    
    // Validate single field on blur if it's been touched
    try {
      const fieldSchema = loginSchema.shape[field];
      if (fieldSchema) {
        fieldSchema.parse(formData[field]);
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.issues[0]?.message,
        }));
      }
    }
  }, [formData]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          if (!newErrors[field]) {
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouchedFields(new Set(['email', 'password']));

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Login user
      const response = await loginWithEmail(
        formData.email,
        formData.password,
        formData.rememberMe || false
      );

      if (response.success && response.data) {
        // Store user and session
        login(response.data.user, response.data.session);
        
        // Show success message
        toast.success(`Welcome back, ${response.data.user.name || 'User'}! 👋`);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // Handle error
        const errorMessage = response.error?.message || 'Invalid email or password. Please try again.';
        
        if (response.error?.field) {
          setErrors((prev) => ({
            ...prev,
            [response.error!.field as keyof FormErrors]: errorMessage,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: errorMessage,
          }));
        }

        toast.error(errorMessage);
        setError({
          code: response.error?.code || 'LOGIN_FAILED',
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [formData, validateForm, login, setLoading, setError, router]);

  // Reset form
  const reset = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      rememberMe: false,
    });
    setErrors({});
    setTouchedFields(new Set());
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    touchedFields,
    updateField,
    handleBlur,
    handleSubmit,
    reset,
  };
};
