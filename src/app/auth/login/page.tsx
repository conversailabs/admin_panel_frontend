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

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      const emailValidation = validators.email(values.email);
      if (emailValidation !== true) errors.email = emailValidation;
      
      const passwordValidation = validators.required(values.password);
      if (passwordValidation !== true) errors.password = passwordValidation;
      
      return errors;
    },
    onSubmit: async (values) => {
      try {
        console.log('Login form submitted:', values);
        setError('');
        
        const response = await apiClient.login(values.email, values.password);
        console.log('Login response:', response);
        
        if (response.success && response.data) {
          const authData = response.data as any;
          apiClient.setToken(authData.access_token);
          
          // If user doesn't have an organization, redirect to create one
          if (!authData.org_id) {
            router.push('/organization/create');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(response.error || 'Login failed');
          // The form's isSubmitting will be reset in the finally block
        }
      } catch (error) {
        setError('Network error occurred');
        console.error('Login error:', error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
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
                label="Password"
                type="password"
                value={form.values.password}
                onChange={(e) => form.handleChange('password', e.target.value)}
                onBlur={() => form.handleBlur('password')}
                error={form.touched.password ? form.errors.password : ''}
                placeholder="Enter your password"
                required
              />

              <Button
                type="submit"
                className="w-full"
                loading={form.isSubmitting}
                disabled={form.isSubmitting}
                onClick={() => console.log('Button clicked, isSubmitting:', form.isSubmitting)}
              >
                Sign in
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