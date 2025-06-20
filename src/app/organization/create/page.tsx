'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useForm } from '@/hooks/useForm';
import { validators } from '@/utils/validation';
import { apiClient } from '@/lib/api';

interface OrganizationForm {
  name: string;
  billingEmail: string;
}

export default function CreateOrganizationPage() {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const form = useForm<OrganizationForm>({
    initialValues: {
      name: '',
      billingEmail: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      const nameValidation = validators.required(values.name);
      if (nameValidation !== true) errors.name = nameValidation;
      
      if (values.billingEmail) {
        const emailValidation = validators.email(values.billingEmail);
        if (emailValidation !== true) errors.billingEmail = emailValidation;
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      setError('');
      
      const response = await apiClient.createOrganization(
        values.name,
        values.billingEmail || undefined
      );
      
      if (response.success) {
        router.push('/dashboard');
      } else {
        setError(response.error || 'Failed to create organization');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Organization
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Setup your organization to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Setup</CardTitle>
            <CardDescription>
              Create your organization to manage AI sales agents and campaigns
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
                label="Organization Name"
                value={form.values.name}
                onChange={(e) => form.handleChange('name', e.target.value)}
                onBlur={() => form.handleBlur('name')}
                error={form.touched.name ? form.errors.name : ''}
                placeholder="Enter your organization name"
                required
              />

              <Input
                label="Billing Email"
                type="email"
                value={form.values.billingEmail}
                onChange={(e) => form.handleChange('billingEmail', e.target.value)}
                onBlur={() => form.handleBlur('billingEmail')}
                error={form.touched.billingEmail ? form.errors.billingEmail : ''}
                placeholder="billing@yourcompany.com (optional)"
                helperText="Optional - used for billing and invoices"
              />

              <Button
                type="submit"
                className="w-full"
                loading={form.isSubmitting}
                disabled={!form.isValid || form.isSubmitting}
              >
                Create Organization
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}