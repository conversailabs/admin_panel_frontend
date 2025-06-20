'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useForm } from '@/hooks/useForm';
import { validators } from '@/utils/validation';
import { Campaign, CampaignStep, CampaignTemplate } from '@/types/campaign';
import { Agent, Lead } from '@/types';

interface CampaignForm {
  name: string;
  description: string;
  type: Campaign['type'];
  agent_id: string;
  template_id: string;
  lead_selection_method: 'manual' | 'filter' | 'import';
  selected_lead_ids: string[];
  timezone: string;
  business_hours_start: string;
  business_hours_end: string;
  allowed_days: string[];
  respect_holidays: boolean;
  sequence: CampaignStep[];
}

const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'cold_outreach_3touch',
    name: 'Cold Outreach (3-Touch)',
    description: 'Call → Wait 1 day → Email → Wait 2 days → Follow-up Call',
    type: 'cold_outreach',
    estimated_duration_days: 4,
    recommended_for: ['New prospects', 'Cold leads'],
    sequence: [
      {
        name: 'Initial Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Introduction and value proposition',
        order: 1
      },
      {
        name: 'Wait Period',
        type: 'wait',
        delay_hours: 24,
        channel: 'voice',
        order: 2
      },
      {
        name: 'Follow-up Email',
        type: 'email',
        delay_hours: 0,
        channel: 'email',
        message: 'Thank you for your time, here are the details we discussed',
        order: 3
      },
      {
        name: 'Wait Period',
        type: 'wait',
        delay_hours: 48,
        channel: 'voice',
        order: 4
      },
      {
        name: 'Final Follow-up Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Final attempt to connect and close',
        order: 5
      }
    ]
  },
  {
    id: 'lead_nurturing_5touch',
    name: 'Lead Nurturing (5-Touch)',
    description: 'Call → Email → Wait 3 days → Call → SMS → Wait 1 week → Call',
    type: 'lead_nurturing',
    estimated_duration_days: 11,
    recommended_for: ['Qualified leads', 'Warm prospects'],
    sequence: [
      {
        name: 'Initial Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Introduction and needs assessment',
        order: 1
      },
      {
        name: 'Information Email',
        type: 'email',
        delay_hours: 2,
        channel: 'email',
        message: 'Detailed information based on call discussion',
        order: 2
      },
      {
        name: 'Wait Period',
        type: 'wait',
        delay_hours: 72,
        channel: 'voice',
        order: 3
      },
      {
        name: 'Check-in Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Follow up on information sent',
        order: 4
      },
      {
        name: 'SMS Reminder',
        type: 'sms',
        delay_hours: 24,
        channel: 'sms',
        message: 'Quick reminder about our conversation',
        order: 5
      },
      {
        name: 'Wait Period',
        type: 'wait',
        delay_hours: 168,
        channel: 'voice',
        order: 6
      },
      {
        name: 'Final Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Decision timeline and next steps',
        order: 7
      }
    ]
  },
  {
    id: 'event_followup',
    name: 'Event Follow-up',
    description: 'Call → Thank you email → Survey request',
    type: 'event_followup',
    estimated_duration_days: 3,
    recommended_for: ['Event attendees', 'Demo participants'],
    sequence: [
      {
        name: 'Initial Call',
        type: 'call',
        delay_hours: 24,
        channel: 'voice',
        message: 'Thank you for attending, follow up on interests',
        order: 1
      },
      {
        name: 'Thank You Email',
        type: 'email',
        delay_hours: 2,
        channel: 'email',
        message: 'Thank you email with resources and next steps',
        order: 2
      },
      {
        name: 'Wait Period',
        type: 'wait',
        delay_hours: 48,
        channel: 'voice',
        order: 3
      },
      {
        name: 'Survey Request',
        type: 'email',
        delay_hours: 0,
        channel: 'email',
        message: 'Request feedback and satisfaction survey',
        order: 4
      }
    ]
  }
];

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string>('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const router = useRouter();

  const totalSteps = 4;

  useEffect(() => {
    loadAgents();
    loadLeads();
  }, []);

  const loadAgents = async () => {
    setLoadingAgents(true);
    try {
      // Mock agents for now
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'Sarah Wilson',
          identity_name: 'Sarah',
          identity_role: 'Sales Rep',
          identity_org: 'Company',
          language: 'english',
          enabled_channels: ['voice', 'email'],
          voice_provider: 'retell',
          voice_id: 'en-us-female',
          voice_settings: { speed: 1.0, pitch: 1.0 },
          prompt_config: { objectives: [], instructions: '' },
          llm_config: { model: 'gpt-3.5-turbo', temperature: 0.7, max_tokens: 150 },
          organization_id: 'org1',
          created_by: 'user1',
          created_at: '2024-06-20T10:00:00Z',
          updated_at: '2024-06-20T10:00:00Z'
        }
      ];
      setAgents(mockAgents);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoadingAgents(false);
    }
  };

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      // Mock leads for now
      const mockLeads: Lead[] = [
        {
          id: '1',
          organization_id: 'org1',
          name: 'John Doe',
          email: 'john@example.com',
          phone_number: '+1234567890',
          company: 'Example Corp',
          title: 'CEO',
          industry: 'Technology',
          location: 'New York',
          lead_source: 'website',
          status: 'new',
          tags: ['enterprise'],
          custom_fields: {},
          created_at: '2024-06-20T10:00:00Z',
          updated_at: '2024-06-20T10:00:00Z'
        }
      ];
      setLeads(mockLeads);
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const form = useForm<CampaignForm>({
    initialValues: {
      name: '',
      description: '',
      type: 'cold_outreach',
      agent_id: '',
      template_id: '',
      lead_selection_method: 'manual',
      selected_lead_ids: [],
      timezone: 'America/New_York',
      business_hours_start: '09:00',
      business_hours_end: '17:00',
      allowed_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      respect_holidays: true,
      sequence: []
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      if (currentStep === 1) {
        const nameValidation = validators.required(values.name);
        if (nameValidation !== true) errors.name = nameValidation;
        
        const descValidation = validators.required(values.description);
        if (descValidation !== true) errors.description = descValidation;
        
        if (!values.agent_id) errors.agent_id = 'Please select an agent';
      }
      
      if (currentStep === 2) {
        if (!values.template_id) errors.template_id = 'Please select a template';
      }
      
      if (currentStep === 3) {
        if (values.selected_lead_ids.length === 0) {
          errors.selected_lead_ids = 'Please select at least one lead';
        }
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        return;
      }
      
      setError('');
      
      try {
        // Create campaign logic here
        console.log('Creating campaign:', values);
        router.push('/dashboard/campaigns');
      } catch (error) {
        setError('Failed to create campaign');
        console.error('Campaign creation error:', error);
      }
    },
  });

  const handleNext = () => {
    form.handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectTemplate = (template: CampaignTemplate) => {
    form.setFieldValue('template_id', template.id);
    form.setFieldValue('type', template.type);
    form.setFieldValue('sequence', template.sequence.map((step, index) => ({
      ...step,
      id: `step_${index + 1}`
    })));
  };

  const toggleDay = (day: string) => {
    const current = form.values.allowed_days;
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    form.setFieldValue('allowed_days', updated);
  };

  const toggleLead = (leadId: string) => {
    const current = form.values.selected_lead_ids;
    const updated = current.includes(leadId)
      ? current.filter(id => id !== leadId)
      : [...current, leadId];
    form.setFieldValue('selected_lead_ids', updated);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Campaign Details
              </h3>
              <div className="space-y-4">
                <Input
                  label="Campaign Name"
                  value={form.values.name}
                  onChange={(e) => form.handleChange('name', e.target.value)}
                  onBlur={() => form.handleBlur('name')}
                  error={form.touched.name ? form.errors.name : ''}
                  placeholder="e.g., Q1 Enterprise Outreach"
                  required
                />
                
                <Textarea
                  label="Description"
                  value={form.values.description}
                  onChange={(e) => form.handleChange('description', e.target.value)}
                  onBlur={() => form.handleBlur('description')}
                  error={form.touched.description ? form.errors.description : ''}
                  placeholder="Describe the campaign goals and target audience..."
                  rows={3}
                  required
                />
                
                <Select
                  label="Campaign Type"
                  value={form.values.type}
                  onChange={(value) => form.handleChange('type', value)}
                  options={[
                    { value: 'cold_outreach', label: 'Cold Outreach' },
                    { value: 'lead_nurturing', label: 'Lead Nurturing' },
                    { value: 'event_followup', label: 'Event Follow-up' },
                    { value: 'winback', label: 'Win-back' },
                    { value: 'custom', label: 'Custom' },
                  ]}
                  required
                />
                
                <Select
                  label="Assigned Agent"
                  value={form.values.agent_id}
                  onChange={(value) => form.handleChange('agent_id', value)}
                  error={form.touched.agent_id ? form.errors.agent_id : ''}
                  options={agents.map(agent => ({
                    value: agent.id,
                    label: `${agent.name} (${agent.identity_role})`
                  }))}
                  disabled={loadingAgents}
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Campaign Template
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose a pre-built template or start from scratch
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CAMPAIGN_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      form.values.template_id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => selectTemplate(template)}
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {template.estimated_duration_days} days
                        </span>
                        <span className="text-gray-500">
                          {template.sequence.length} steps
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.recommended_for.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {form.touched.template_id && form.errors.template_id && (
                <p className="mt-2 text-sm text-red-600">{form.errors.template_id}</p>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Lead Selection
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selection Method
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'manual', label: 'Manual Selection', description: 'Choose leads individually' },
                      { id: 'filter', label: 'Filter-based', description: 'Select by criteria (coming soon)' },
                      { id: 'import', label: 'Import CSV', description: 'Upload a CSV file (coming soon)' },
                    ].map((method) => (
                      <label key={method.id} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="selection_method"
                          value={method.id}
                          checked={form.values.lead_selection_method === method.id}
                          onChange={(e) => form.handleChange('lead_selection_method', e.target.value)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          disabled={method.id !== 'manual'}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{method.label}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {form.values.lead_selection_method === 'manual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Leads ({form.values.selected_lead_ids.length} selected)
                    </label>
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                      {leads.map((lead) => (
                        <label
                          key={lead.id}
                          className="flex items-center space-x-3 p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.values.selected_lead_ids.includes(lead.id)}
                            onChange={() => toggleLead(lead.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-gray-500">
                              {lead.company} • {lead.title}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    {form.touched.selected_lead_ids && form.errors.selected_lead_ids && (
                      <p className="mt-2 text-sm text-red-600">{form.errors.selected_lead_ids}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Schedule & Configuration
              </h3>
              
              <div className="space-y-4">
                <Select
                  label="Timezone"
                  value={form.values.timezone}
                  onChange={(value) => form.handleChange('timezone', value)}
                  options={[
                    { value: 'America/New_York', label: 'Eastern Time (ET)' },
                    { value: 'America/Chicago', label: 'Central Time (CT)' },
                    { value: 'America/Denver', label: 'Mountain Time (MT)' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  ]}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Business Hours Start"
                    type="time"
                    value={form.values.business_hours_start}
                    onChange={(e) => form.handleChange('business_hours_start', e.target.value)}
                  />
                  
                  <Input
                    label="Business Hours End"
                    type="time"
                    value={form.values.business_hours_end}
                    onChange={(e) => form.handleChange('business_hours_end', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Allowed Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.values.allowed_days.includes(day)}
                          onChange={() => toggleDay(day)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.values.respect_holidays}
                    onChange={(e) => form.handleChange('respect_holidays', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Respect holidays and skip outreach</span>
                </label>
              </div>
            </div>
            
            {/* Campaign Summary */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Campaign Summary</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div><strong>Name:</strong> {form.values.name}</div>
                <div><strong>Type:</strong> {form.values.type.replace('_', ' ')}</div>
                <div><strong>Agent:</strong> {agents.find(a => a.id === form.values.agent_id)?.name || 'Not selected'}</div>
                <div><strong>Leads:</strong> {form.values.selected_lead_ids.length} selected</div>
                <div><strong>Template:</strong> {CAMPAIGN_TEMPLATES.find(t => t.id === form.values.template_id)?.name || 'None'}</div>
                <div><strong>Steps:</strong> {form.values.sequence.length}</div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}: Set up your outreach campaign
          </p>
        </div>
        <Link href="/dashboard/campaigns">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={form.handleSubmit}>
            {renderStepContent()}
            
            <div className="flex justify-between pt-6 border-t mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              <Button
                type="submit"
                loading={form.isSubmitting}
                disabled={form.isSubmitting}
              >
                {currentStep === totalSteps ? 'Create Campaign' : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}