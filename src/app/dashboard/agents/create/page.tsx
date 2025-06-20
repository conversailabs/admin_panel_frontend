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
import { apiClient } from '@/lib/api';
import { CreateAgentRequest, VoiceProvider } from '@/types';
import { Tabs } from '@/components/ui/Tabs';

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

interface AgentForm {
  // Basic Info
  name: string;
  
  // Voice Settings
  voiceId: string;
  
  // Channels
  enabledChannels: string[];
  
  // Prompt Config
  greetingMessage: string;
  yamlPrompt: string;
  
  // Call Flow Config
  callOutcomeRules: CallOutcomeRule[];
}

const YAML_TEMPLATES = {
  leadQualification: `# Lead Qualification Agent
identity:
  name: "{name}"
  role: "{role}"
  organization: "{organization}"

greeting: "{greeting}"

intro_optin: "I'd like to ask you a few questions to understand your needs better. Is that okay?"

flow:
  - id: q1
    type: question
    text: "May I know what specific challenges you're facing with your current solution?"
    entity: current_challenges
    followups:
      - "Could you elaborate on that?"
      - "How long have you been experiencing this issue?"
  
  - id: q2
    type: question
    text: "What's your budget range for solving this problem?"
    entity: budget_range
    followups:
      - "Is this budget already approved?"
  
  - id: q3
    type: question
    text: "Who would be involved in making this decision?"
    entity: decision_makers

closing: "Thank you for your time. We'll get back to you with a tailored solution."`,

  appointmentSetting: `# Appointment Setting Agent
identity:
  name: "{name}"
  role: "{role}"
  organization: "{organization}"

greeting: "{greeting}"

intro_optin: "I'm calling to schedule a brief demo of our solution. Do you have a moment?"

flow:
  - id: intro
    type: info
    text: "We have a 15-minute demo that shows how we can help reduce your costs by 30%."
  
  - id: q1
    type: question
    text: "Would you be interested in seeing a quick demo?"
    entity: demo_interest
    
  - id: q2
    type: question
    text: "What day this week works best for you?"
    entity: preferred_day
    
  - id: q3
    type: question
    text: "Morning or afternoon?"
    entity: preferred_time

closing: "Perfect! I'll send you a calendar invite. Looking forward to speaking with you."`,

  followUp: `# Follow-up Agent
identity:
  name: "{name}"
  role: "{role}"
  organization: "{organization}"

greeting: "{greeting}"

intro_optin: "I'm following up on our previous conversation about your interest in our solution."

flow:
  - id: q1
    type: question
    text: "Have you had a chance to review the proposal we sent?"
    entity: proposal_reviewed
    
  - id: q2
    type: question
    text: "Do you have any questions about the pricing or features?"
    entity: questions
    
  - id: q3
    type: question
    text: "What would be the next steps from your side?"
    entity: next_steps

closing: "Thank you for your time. I'll follow up based on what we discussed."`
};

export default function CreateAgentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const totalSteps = 4;

  const defaultCallOutcomeRules: CallOutcomeRule[] = [
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

  const form = useForm<AgentForm>({
    initialValues: {
      name: '',
      voiceId: '',
      enabledChannels: ['voice'],
      greetingMessage: 'Hello, this is {name} from {organization}.',
      yamlPrompt: YAML_TEMPLATES.leadQualification,
      callOutcomeRules: defaultCallOutcomeRules,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      
      if (currentStep === 1) {
        const nameValidation = validators.required(values.name);
        if (nameValidation !== true) errors.name = nameValidation;
      }
      
      if (currentStep === 2) {
        if (!values.voiceId) errors.voiceId = 'Please select a voice';
      }
      
      if (currentStep === 3) {
        const greetingValidation = validators.required(values.greetingMessage);
        if (greetingValidation !== true) errors.greetingMessage = greetingValidation;
        
        const yamlValidation = validators.required(values.yamlPrompt);
        if (yamlValidation !== true) errors.yamlPrompt = yamlValidation;
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        return;
      }
      
      setError('');
      
      // Parse YAML to extract identity information
      let identityName = 'Agent';
      let identityRole = 'Sales Representative';
      let identityOrg = 'Company';
      
      try {
        const yamlLines = values.yamlPrompt.split('\n');
        const identitySection = yamlLines.findIndex(line => line.trim() === 'identity:');
        if (identitySection >= 0) {
          for (let i = identitySection + 1; i < yamlLines.length && yamlLines[i].startsWith('  '); i++) {
            const line = yamlLines[i].trim();
            if (line.startsWith('name:')) {
              identityName = line.replace('name:', '').trim().replace(/["{}']/g, '');
            } else if (line.startsWith('role:')) {
              identityRole = line.replace('role:', '').trim().replace(/["{}']/g, '');
            } else if (line.startsWith('organization:')) {
              identityOrg = line.replace('organization:', '').trim().replace(/["{}']/g, '');
            }
          }
        }
      } catch (err) {
        console.error('Failed to parse YAML:', err);
      }
      
      // Convert form data to API format
      const agentData: CreateAgentRequest = {
        name: values.name,
        identity_name: identityName,
        identity_role: identityRole,
        identity_org: identityOrg,
        language: 'english', // Default language
        enabled_channels: values.enabledChannels as ('voice' | 'email' | 'sms')[],
        voice_provider: 'retell', // Default provider
        voice_id: values.voiceId,
        voice_settings: {
          speed: 1.0, // Default speed
          pitch: 1.0, // Default pitch
        },
        prompt_config: {
          objectives: ['Generate leads', 'Qualify prospects', 'Book appointments'], // Default objectives
          instructions: values.yamlPrompt, // Store full YAML as instructions
        },
        llm_config: {
          model: 'gpt-3.5-turbo', // Default model
          temperature: 0.7, // Default temperature
          max_tokens: 150, // Default tokens
        },
      };
      
      const response = await apiClient.createAgent(agentData);
      
      if (response.success) {
        router.push('/dashboard/agents');
      } else {
        setError(response.error || 'Failed to create agent');
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

  const toggleChannel = (channel: string) => {
    const current = form.values.enabledChannels;
    const updated = current.includes(channel)
      ? current.filter(c => c !== channel)
      : [...current, channel];
    form.setFieldValue('enabledChannels', updated);
  };

  const applyTemplate = (templateKey: keyof typeof YAML_TEMPLATES) => {
    form.setFieldValue('yamlPrompt', YAML_TEMPLATES[templateKey]);
  };

  const updateCallOutcomeRule = (index: number, field: keyof CallOutcomeRule, value: any) => {
    const updated = [...form.values.callOutcomeRules];
    updated[index] = { ...updated[index], [field]: value };
    form.setFieldValue('callOutcomeRules', updated);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Agent Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Agent Name"
                  value={form.values.name}
                  onChange={(e) => form.handleChange('name', e.target.value)}
                  onBlur={() => form.handleBlur('name')}
                  error={form.touched.name ? form.errors.name : ''}
                  placeholder="e.g., Sales Agent 1"
                  required
                  helperText="This is the display name for your agent in the dashboard"
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
                Voice & Channels
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enabled Channels *
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'voice', label: 'Voice Calls', description: 'AI-powered voice conversations' },
                      { id: 'email', label: 'Email', description: 'Automated email campaigns' },
                      { id: 'sms', label: 'SMS', description: 'Text message outreach' },
                    ].map((channel) => (
                      <div key={channel.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id={channel.id}
                          checked={form.values.enabledChannels.includes(channel.id)}
                          onChange={() => toggleChannel(channel.id)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label htmlFor={channel.id} className="font-medium text-gray-900">
                            {channel.label}
                          </label>
                          <p className="text-sm text-gray-500">{channel.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Voice Selection *
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'en-us-male', label: 'English US Male' },
                      { id: 'en-us-female', label: 'English US Female' },
                      { id: 'en-uk-male', label: 'English UK Male' },
                      { id: 'en-uk-female', label: 'English UK Female' },
                      { id: 'hinglish-male', label: 'Hinglish Male' },
                      { id: 'hinglish-female', label: 'Hinglish Female' },
                    ].map((voice) => (
                      <label key={voice.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="voice"
                          value={voice.id}
                          checked={form.values.voiceId === voice.id}
                          onChange={(e) => form.handleChange('voiceId', e.target.value)}
                          disabled={!form.values.enabledChannels.includes('voice')}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className={`font-medium ${!form.values.enabledChannels.includes('voice') ? 'text-gray-400' : 'text-gray-900'}`}>
                          {voice.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {form.touched.voiceId && form.errors.voiceId && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.voiceId}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Agent Prompt & Behavior
              </h3>
              
              <div className="space-y-6">
                {/* Greeting Message */}
                <div>
                  <Input
                    label="Greeting Message"
                    value={form.values.greetingMessage}
                    onChange={(e) => form.handleChange('greetingMessage', e.target.value)}
                    onBlur={() => form.handleBlur('greetingMessage')}
                    error={form.touched.greetingMessage ? form.errors.greetingMessage : ''}
                    placeholder="Hello, this is {name} from {organization}."
                    required
                    helperText="The first message the agent will say. Use {name} and {organization} as placeholders."
                  />
                </div>

                {/* YAML Editor with Templates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Script (YAML)
                    {form.errors.yamlPrompt && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  
                  {/* Template Selection */}
                  <div className="mb-3">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyTemplate('leadQualification')}
                      >
                        Lead Qualification
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyTemplate('appointmentSetting')}
                      >
                        Appointment Setting
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyTemplate('followUp')}
                      >
                        Follow-up
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Click a template to start, then customize the YAML below
                    </p>
                  </div>

                  {/* YAML Editor */}
                  <Textarea
                    value={form.values.yamlPrompt}
                    onChange={(e) => form.handleChange('yamlPrompt', e.target.value)}
                    onBlur={() => form.handleBlur('yamlPrompt')}
                    error={form.touched.yamlPrompt ? form.errors.yamlPrompt : ''}
                    rows={20}
                    className="font-mono text-sm"
                    placeholder="# Enter your YAML configuration here..."
                  />
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium mb-1">Available placeholders:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><code className="bg-gray-100 px-1">{'{name}'}</code> - Agent's name</li>
                      <li><code className="bg-gray-100 px-1">{'{role}'}</code> - Agent's role</li>
                      <li><code className="bg-gray-100 px-1">{'{organization}'}</code> - Organization name</li>
                      <li><code className="bg-gray-100 px-1">{'{greeting}'}</code> - Greeting message</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Call Flow & Outcome Management
              </h3>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Configure how the agent should handle different call outcomes and retry logic.
                </p>
                
                {/* Call Outcome Rules */}
                <div className="space-y-4">
                  {form.values.callOutcomeRules.map((rule, index) => (
                    <div key={rule.outcome} className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {rule.outcome.replace('_', ' ')}
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Action"
                          value={rule.action}
                          onChange={(value) => updateCallOutcomeRule(index, 'action', value)}
                          options={[
                            { value: 'retry', label: 'Retry' },
                            { value: 'no_retry', label: 'No Retry' },
                            { value: 'schedule', label: 'Schedule' },
                            { value: 'review', label: 'Review' },
                          ]}
                        />
                        
                        {rule.action === 'retry' && (
                          <>
                            <Input
                              label="Wait Time (minutes)"
                              type="number"
                              value={rule.waitTime}
                              onChange={(e) => updateCallOutcomeRule(index, 'waitTime', parseInt(e.target.value))}
                              min={0}
                            />
                            
                            <Input
                              label="Max Attempts"
                              type="number"
                              value={rule.maxAttempts}
                              onChange={(e) => updateCallOutcomeRule(index, 'maxAttempts', parseInt(e.target.value))}
                              min={0}
                              max={10}
                            />
                          </>
                        )}
                      </div>
                      
                      {(rule.action === 'retry' || rule.action === 'schedule') && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Allowed Days
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                <label key={day} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={rule.scheduleDays.includes(day)}
                                    onChange={(e) => {
                                      const days = e.target.checked
                                        ? [...rule.scheduleDays, day]
                                        : rule.scheduleDays.filter(d => d !== day);
                                      updateCallOutcomeRule(index, 'scheduleDays', days);
                                    }}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm">{day}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Start Time"
                              type="time"
                              value={rule.timeWindow.start}
                              onChange={(e) => {
                                const timeWindow = { ...rule.timeWindow, start: e.target.value };
                                updateCallOutcomeRule(index, 'timeWindow', timeWindow);
                              }}
                            />
                            
                            <Input
                              label="End Time"
                              type="time"
                              value={rule.timeWindow.end}
                              onChange={(e) => {
                                const timeWindow = { ...rule.timeWindow, end: e.target.value };
                                updateCallOutcomeRule(index, 'timeWindow', timeWindow);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Summary */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Agent Summary</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div><strong>Agent Name:</strong> {form.values.name}</div>
                <div><strong>Voice:</strong> {form.values.voiceId ? form.values.voiceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not selected'}</div>
                <div><strong>Channels:</strong> {form.values.enabledChannels.join(', ')}</div>
                <div><strong>Greeting:</strong> {form.values.greetingMessage}</div>
                <div><strong>Call Retry Rules:</strong> {form.values.callOutcomeRules.filter(r => r.action === 'retry').length} configured</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Create Agent</h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}: Configure your AI sales agent
          </p>
        </div>
        <Link href="/dashboard/agents">
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
                {currentStep === totalSteps ? 'Create Agent' : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}