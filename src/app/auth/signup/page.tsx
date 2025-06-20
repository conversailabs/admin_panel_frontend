'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useForm } from '@/hooks/useForm';
import { validators } from '@/utils/validation';
import { apiClient } from '@/lib/api';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export default function SignupPage() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();

  const form = useForm<SignupForm>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      const nameValidation = validators.required(values.name);
      if (nameValidation !== true) errors.name = nameValidation;
      
      const emailValidation = validators.email(values.email);
      if (emailValidation !== true) errors.email = emailValidation;
      
      const passwordValidation = validators.password(values.password);
      if (passwordValidation !== true) errors.password = passwordValidation;
      
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (values.phoneNumber) {
        const phoneValidation = validators.phone(values.phoneNumber);
        if (phoneValidation !== true) {
          errors.phoneNumber = phoneValidation;
        }
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      setError('');
      setSuccess('');
      
      const response = await apiClient.signup(
        values.email,
        values.password,
        values.name,
        values.phoneNumber || undefined
      );
      
      if (response.success) {
        setSuccess('Account created successfully! Please sign in.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(response.error || 'Signup failed');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to get started with AI sales agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Success
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        {success}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Input
                label="Full Name"
                value={form.values.name}
                onChange={(e) => form.handleChange('name', e.target.value)}
                onBlur={() => form.handleBlur('name')}
                error={form.touched.name ? form.errors.name : ''}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email"
                type="email"
                value={form.values.email}
                onChange={(e) => form.handleChange('email', e.target.value)}
                onBlur={() => form.handleBlur('email')}
                error={form.touched.email ? form.errors.email : ''}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={form.values.phoneNumber}
                onChange={(e) => form.handleChange('phoneNumber', e.target.value)}
                onBlur={() => form.handleBlur('phoneNumber')}
                error={form.touched.phoneNumber ? form.errors.phoneNumber : ''}
                placeholder="+1234567890 (optional)"
                helperText="Optional - used for account recovery"
              />

              <Input
                label="Password"
                type="password"
                value={form.values.password}
                onChange={(e) => form.handleChange('password', e.target.value)}
                onBlur={() => form.handleBlur('password')}
                error={form.touched.password ? form.errors.password : ''}
                placeholder="Create a password"
                required
                helperText="At least 8 characters with uppercase, lowercase, and number"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={form.values.confirmPassword}
                onChange={(e) => form.handleChange('confirmPassword', e.target.value)}
                onBlur={() => form.handleBlur('confirmPassword')}
                error={form.touched.confirmPassword ? form.errors.confirmPassword : ''}
                placeholder="Confirm your password"
                required
              />

              <Button
                type="submit"
                className="w-full"
                loading={form.isSubmitting}
                disabled={!form.isValid || form.isSubmitting}
              >
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}