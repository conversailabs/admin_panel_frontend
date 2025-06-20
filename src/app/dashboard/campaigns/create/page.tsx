'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useForm } from '@/hooks/useForm';
import { validators } from '@/utils/validation';
import { Campaign, CampaignStep, CampaignTemplate } from '@/types/campaign';
import { Lead } from '@/types';
import { CAMPAIGN_TEMPLATES_LIBRARY, AGENT_PERSONA_TEMPLATES, getAgentPersonaForTemplate } from '@/data/campaignTemplates';

interface AgentPersona {
  name: string;
  voice: string;
  greetingMessage: string;
  conversationScript: string;
  callOutcomeRules: CallOutcomeRule[];
}

interface CallOutcomeRule {
  outcome: string;
  action: 'retry' | 'no_retry' | 'schedule' | 'review';
  waitTime: number;
  maxAttempts: number;
  scheduleDays: string[];
  timeWindow: {
    start: string;
    end: string;
  };
}

interface CampaignForm {
  // Campaign Basics
  name: string;
  description: string;
  type: Campaign['type'];
  
  // Agent Persona (embedded)
  agentPersona: AgentPersona;
  
  // Template & Sequence
  template_id: string;
  sequence: CampaignStep[];
  
  // Lead Selection
  lead_selection_method: 'manual' | 'filter' | 'import';
  selected_lead_ids: string[];
  
  // Scheduling
  timezone: string;
  business_hours_start: string;
  business_hours_end: string;
  allowed_days: string[];
  respect_holidays: boolean;
}



const DEFAULT_CALL_OUTCOME_RULES: CallOutcomeRule[] = [
  {
    outcome: 'no_answer',
    action: 'retry',
    waitTime: 30,
    maxAttempts: 3,
    scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeWindow: { start: '10:00', end: '18:00' }
  },
  {
    outcome: 'busy',
    action: 'retry',
    waitTime: 60,
    maxAttempts: 2,
    scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeWindow: { start: '10:00', end: '18:00' }
  },
  {
    outcome: 'callback',
    action: 'schedule',
    waitTime: 0,
    maxAttempts: 2,
    scheduleDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeWindow: { start: '10:00', end: '18:00' }
  },
  {
    outcome: 'not_interested',
    action: 'no_retry',
    waitTime: 0,
    maxAttempts: 0,
    scheduleDays: [],
    timeWindow: { start: '10:00', end: '18:00' }
  }
];

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string>('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const router = useRouter();

  // Get template from URL params if provided
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const templateParam = searchParams.get('template');

  const totalSteps = 5;

  useEffect(() => {
    loadLeads();
    
    // Auto-apply template if provided
    if (templateParam) {
      const template = CAMPAIGN_TEMPLATES_LIBRARY.find(t => t.id === templateParam);
      if (template) {
        selectTemplate(template);
      }
    }
  }, [templateParam]);

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
        },
        {
          id: '2',
          organization_id: 'org1',
          name: 'Jane Smith',
          email: 'jane@techstartup.com',
          phone_number: '+1234567891',
          company: 'Tech Startup Inc',
          title: 'CTO',
          industry: 'Software',
          location: 'San Francisco',
          lead_source: 'linkedin',
          status: 'new',
          tags: ['startup', 'technical'],
          custom_fields: {},
          created_at: '2024-06-20T11:00:00Z',
          updated_at: '2024-06-20T11:00:00Z'
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
      agentPersona: {
        name: 'Sarah',
        voice: 'en-us-female',
        greetingMessage: 'Hi {lead_name}, this is {name} from {organization}.',
        conversationScript: AGENT_PERSONA_TEMPLATES.saasSDR.conversationScript,
        callOutcomeRules: DEFAULT_CALL_OUTCOME_RULES,
      },
      template_id: '',
      sequence: [],
      lead_selection_method: 'manual',
      selected_lead_ids: [],
      timezone: 'America/New_York',
      business_hours_start: '09:00',
      business_hours_end: '17:00',
      allowed_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      respect_holidays: true,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      if (currentStep === 1) {
        const nameValidation = validators.required(values.name);
        if (nameValidation !== true) errors.name = nameValidation;
        
        const descValidation = validators.required(values.description);
        if (descValidation !== true) errors.description = descValidation;
        
        if (!values.agentPersona.name) errors['agentPersona.name'] = 'Agent name is required';
        if (!values.agentPersona.voice) errors['agentPersona.voice'] = 'Voice selection is required';
      }
      
      if (currentStep === 2) {
        if (!values.template_id) errors.template_id = 'Please select a template';
      }
      
      if (currentStep === 3) {
        if (values.sequence.length === 0) {
          errors.sequence = 'Please configure at least one sequence step';
        }
      }
      
      if (currentStep === 4) {
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
        // Create campaign with embedded agent persona
        console.log('Creating campaign with embedded agent:', values);
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

    // Auto-apply appropriate agent persona for the template
    const agentPersona = getAgentPersonaForTemplate(template.id);
    if (agentPersona) {
      form.setFieldValue('agentPersona', {
        ...form.values.agentPersona,
        name: agentPersona.name,
        voice: agentPersona.voice,
        greetingMessage: agentPersona.greetingMessage,
        conversationScript: agentPersona.conversationScript,
      });
    }
  };

  const applyPersonaTemplate = (templateKey: keyof typeof AGENT_PERSONA_TEMPLATES) => {
    const template = AGENT_PERSONA_TEMPLATES[templateKey];
    form.setFieldValue('agentPersona', {
      ...form.values.agentPersona,
      name: template.name,
      voice: template.voice,
      greetingMessage: template.greetingMessage,
      conversationScript: template.conversationScript,
    });
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

  // Sequence step management functions
  const addSequenceStep = () => {
    const newStep: CampaignStep = {
      id: `step_${Date.now()}`,
      name: 'New Step',
      type: 'call',
      delay_hours: 24,
      channel: 'voice',
      message: 'Enter your message here',
      order: form.values.sequence.length + 1
    };
    form.setFieldValue('sequence', [...form.values.sequence, newStep]);
  };

  const updateSequenceStep = (stepId: string, field: keyof CampaignStep, value: any) => {
    const updated = form.values.sequence.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    );
    form.setFieldValue('sequence', updated);
  };

  const removeSequenceStep = (stepId: string) => {
    const updated = form.values.sequence.filter(step => step.id !== stepId);
    // Reorder the remaining steps
    const reordered = updated.map((step, index) => ({ ...step, order: index + 1 }));
    form.setFieldValue('sequence', reordered);
  };

  const moveSequenceStep = (stepId: string, direction: 'up' | 'down') => {
    const currentIndex = form.values.sequence.findIndex(step => step.id === stepId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= form.values.sequence.length) return;
    
    const updated = [...form.values.sequence];
    [updated[currentIndex], updated[newIndex]] = [updated[newIndex], updated[currentIndex]];
    
    // Update order numbers
    const reordered = updated.map((step, index) => ({ ...step, order: index + 1 }));
    form.setFieldValue('sequence', reordered);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Campaign Basics */}
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
              </div>
            </div>

            {/* Agent Persona Configuration */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                AI Agent Persona
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure your AI agent's personality and conversation style for this campaign.
              </p>
              
              <div className="space-y-4">
                {/* Persona Templates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Setup Templates
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyPersonaTemplate('saasSDR')}
                    >
                      SaaS Sales Rep
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyPersonaTemplate('realEstateAgent')}
                    >
                      Real Estate Agent
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyPersonaTemplate('insuranceAgent')}
                    >
                      Insurance Specialist
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Agent Name"
                    value={form.values.agentPersona.name}
                    onChange={(e) => form.setFieldValue('agentPersona', { ...form.values.agentPersona, name: e.target.value })}
                    placeholder="e.g., Sarah"
                    required
                  />
                  
                  <Select
                    label="Voice"
                    value={form.values.agentPersona.voice}
                    onChange={(value) => form.setFieldValue('agentPersona', { ...form.values.agentPersona, voice: value })}
                    options={[
                      { value: 'en-us-female', label: 'English US Female' },
                      { value: 'en-us-male', label: 'English US Male' },
                      { value: 'en-uk-female', label: 'English UK Female' },
                      { value: 'en-uk-male', label: 'English UK Male' },
                      { value: 'hinglish-female', label: 'Hinglish Female' },
                      { value: 'hinglish-male', label: 'Hinglish Male' },
                    ]}
                    required
                  />
                </div>
                
                <Input
                  label="Greeting Message"
                  value={form.values.agentPersona.greetingMessage}
                  onChange={(e) => form.setFieldValue('agentPersona', { ...form.values.agentPersona, greetingMessage: e.target.value })}
                  placeholder="Hi {lead_name}, this is {name} from {organization}."
                  helperText="Use {lead_name}, {name}, and {organization} as placeholders"
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
                Campaign Template & Sequence
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose a pre-built template or customize your outreach sequence
              </p>
              
              <div className="mb-4">
                <Link href="/dashboard/campaigns/templates">
                  <Button variant="outline" size="sm">
                    Browse All {CAMPAIGN_TEMPLATES_LIBRARY.length}+ Templates
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CAMPAIGN_TEMPLATES_LIBRARY.slice(0, 6).map((template) => (
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
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{template.name}</h4>
                        {template.industry && (
                          <Badge variant="outline" size="sm">
                            {template.industry}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {template.estimated_duration_days} days
                        </span>
                        <span className="text-gray-500">
                          {template.sequence.length} steps
                        </span>
                      </div>
                      {template.estimatedConversionRate && (
                        <div className="text-xs">
                          <span className="text-green-600 font-medium">
                            {template.estimatedConversionRate} conversion
                          </span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {template.recommended_for.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.recommended_for.length > 2 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{template.recommended_for.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {form.touched.template_id && form.errors.template_id && (
                <p className="mt-2 text-sm text-red-600">{form.errors.template_id}</p>
              )}

              {/* Conversation Script */}
              {form.values.template_id && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Agent Conversation Script
                  </h4>
                  <Textarea
                    label="YAML Script"
                    value={form.values.agentPersona.conversationScript}
                    onChange={(e) => form.setFieldValue('agentPersona', { ...form.values.agentPersona, conversationScript: e.target.value })}
                    rows={15}
                    className="font-mono text-sm"
                    helperText="Customize the conversation flow for your agent"
                  />
                </div>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Campaign Sequence Builder
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Configure the steps your AI agent will follow to nurture leads through your campaign.
              </p>
              
              {/* Sequence Steps */}
              <div className="space-y-4">
                {form.values.sequence.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Step {index + 1}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Badge variant="outline" size="sm">
                              {step.channel}
                            </Badge>
                            <span>•</span>
                            <span>
                              {step.delay_hours === 0 ? 'Immediate' : 
                               step.delay_hours < 24 ? `${step.delay_hours} hours later` :
                               `${Math.floor(step.delay_hours / 24)} days later`}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveSequenceStep(step.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveSequenceStep(step.id, 'down')}
                          disabled={index === form.values.sequence.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSequenceStep(step.id)}
                          disabled={form.values.sequence.length <= 1}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Step Name"
                        value={step.name}
                        onChange={(e) => updateSequenceStep(step.id, 'name', e.target.value)}
                        placeholder="e.g., Initial Qualification Call"
                      />
                      
                      <Select
                        label="Channel"
                        value={step.channel}
                        onChange={(value) => updateSequenceStep(step.id, 'channel', value)}
                        options={[
                          { value: 'voice', label: 'Voice Call' },
                          { value: 'email', label: 'Email' },
                          { value: 'sms', label: 'SMS' },
                        ]}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delay (hours)
                        </label>
                        <Input
                          type="number"
                          value={step.delay_hours}
                          onChange={(e) => updateSequenceStep(step.id, 'delay_hours', parseInt(e.target.value) || 0)}
                          min={0}
                          placeholder="0"
                          helperText="0 = immediate, 24 = 1 day later"
                        />
                      </div>
                      
                      <Select
                        label="Step Type"
                        value={step.type}
                        onChange={(value) => updateSequenceStep(step.id, 'type', value)}
                        options={[
                          { value: 'call', label: 'Call' },
                          { value: 'email', label: 'Email' },
                          { value: 'sms', label: 'SMS' },
                          { value: 'wait', label: 'Wait Period' },
                          { value: 'condition', label: 'Condition' },
                        ]}
                      />
                    </div>
                    
                    <Textarea
                      label="Message/Purpose"
                      value={step.message || ''}
                      onChange={(e) => updateSequenceStep(step.id, 'message', e.target.value)}
                      placeholder="Describe what this step accomplishes..."
                      rows={2}
                    />
                  </div>
                ))}
                
                {/* Add Step Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSequenceStep}
                  >
                    + Add Step
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Add another step to your campaign sequence
                  </p>
                </div>
              </div>
              
              {/* Sequence Summary */}
              {form.values.sequence.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-900 mb-2">Campaign Timeline</h4>
                  <div className="space-y-2">
                    {form.values.sequence.map((step, index) => (
                      <div key={step.id} className="flex items-center text-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs font-medium mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{step.name}</span>
                          <span className="text-blue-700 ml-2">
                            ({step.delay_hours === 0 ? 'Immediate' : 
                              step.delay_hours < 24 ? `${step.delay_hours}h later` :
                              `${Math.floor(step.delay_hours / 24)}d later`})
                          </span>
                        </div>
                        <Badge variant="outline" size="sm">
                          {step.channel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-blue-600">
                    Total campaign duration: {Math.max(...form.values.sequence.map(s => s.delay_hours))} hours 
                    ({Math.ceil(Math.max(...form.values.sequence.map(s => s.delay_hours)) / 24)} days)
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
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
        
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Schedule & Launch
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
                <div><strong>Campaign:</strong> {form.values.name}</div>
                <div><strong>Type:</strong> {form.values.type.replace('_', ' ')}</div>
                <div><strong>Agent:</strong> {form.values.agentPersona.name} ({form.values.agentPersona.voice.replace(/-/g, ' ')})</div>
                <div><strong>Leads:</strong> {form.values.selected_lead_ids.length} selected</div>
                <div><strong>Template:</strong> {CAMPAIGN_TEMPLATES_LIBRARY.find(t => t.id === form.values.template_id)?.name || 'None'}</div>
                <div><strong>Sequence Steps:</strong> {form.values.sequence.length} steps over {Math.ceil(Math.max(...form.values.sequence.map(s => s.delay_hours), 0) / 24)} days</div>
                <div><strong>Schedule:</strong> {form.values.business_hours_start} - {form.values.business_hours_end}, {form.values.allowed_days.join(', ')}</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Create AI Campaign</h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Configure campaign and agent persona' :
              currentStep === 2 ? 'Select template and conversation script' :
              currentStep === 3 ? 'Build your campaign sequence' :
              currentStep === 4 ? 'Select target leads' :
              'Schedule and launch campaign'
            }
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
                {currentStep === totalSteps ? 'Launch Campaign' : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}