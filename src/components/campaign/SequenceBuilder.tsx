'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CampaignStep } from '@/types/campaign';

interface SequenceBuilderProps {
  sequence: CampaignStep[];
  onChange: (sequence: CampaignStep[]) => void;
}

export function SequenceBuilder({ sequence, onChange }: SequenceBuilderProps) {
  const [editingStep, setEditingStep] = useState<string | null>(null);

  const addStep = () => {
    const newStep: CampaignStep = {
      id: `step_${Date.now()}`,
      name: 'New Step',
      type: 'call',
      delay_hours: 0,
      channel: 'voice',
      message: '',
      order: sequence.length + 1,
    };
    onChange([...sequence, newStep]);
    setEditingStep(newStep.id);
  };

  const updateStep = (stepId: string, updates: Partial<CampaignStep>) => {
    const updated = sequence.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onChange(updated);
  };

  const deleteStep = (stepId: string) => {
    const updated = sequence.filter(step => step.id !== stepId);
    // Reorder remaining steps
    const reordered = updated.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    onChange(reordered);
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = sequence.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    if (newIndex < 0 || newIndex >= sequence.length) return;

    const updated = [...sequence];
    [updated[stepIndex], updated[newIndex]] = [updated[newIndex], updated[stepIndex]];
    
    // Update order values
    const reordered = updated.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    
    onChange(reordered);
  };

  const getStepIcon = (type: CampaignStep['type']) => {
    switch (type) {
      case 'call':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        );
      case 'sms':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        );
      case 'wait':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'condition':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getChannelColor = (channel: CampaignStep['channel']) => {
    switch (channel) {
      case 'voice':
        return 'bg-blue-100 text-blue-800';
      case 'email':
        return 'bg-green-100 text-green-800';
      case 'sms':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDelayHours = (hours: number) => {
    if (hours === 0) return 'Immediate';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days}d`;
    return `${days}d ${remainingHours}h`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Sequence Builder</h3>
        <Button onClick={addStep} size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Step
        </Button>
      </div>

      {sequence.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No steps yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add your first step to start building the sequence
              </p>
              <div className="mt-6">
                <Button onClick={addStep}>Add Step</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sequence.map((step, index) => (
            <div key={step.id}>
              <Card>
                <CardContent className="pt-4">
                  {editingStep === step.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Edit Step {step.order}</h4>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingStep(null)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingStep(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Step Name"
                          value={step.name}
                          onChange={(e) => updateStep(step.id, { name: e.target.value })}
                        />
                        
                        <Select
                          label="Step Type"
                          value={step.type}
                          onChange={(value) => updateStep(step.id, { type: value as CampaignStep['type'] })}
                          options={[
                            { value: 'call', label: 'Phone Call' },
                            { value: 'email', label: 'Email' },
                            { value: 'sms', label: 'SMS' },
                            { value: 'wait', label: 'Wait Period' },
                            { value: 'condition', label: 'Condition' },
                          ]}
                        />
                      </div>
                      
                      {step.type !== 'wait' && (
                        <Select
                          label="Channel"
                          value={step.channel}
                          onChange={(value) => updateStep(step.id, { channel: value as CampaignStep['channel'] })}
                          options={[
                            { value: 'voice', label: 'Voice Call' },
                            { value: 'email', label: 'Email' },
                            { value: 'sms', label: 'SMS' },
                          ]}
                        />
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Delay (hours)"
                          type="number"
                          value={step.delay_hours}
                          onChange={(e) => updateStep(step.id, { delay_hours: parseInt(e.target.value) || 0 })}
                          min={0}
                        />
                      </div>
                      
                      {step.type !== 'wait' && (
                        <Textarea
                          label="Message/Description"
                          value={step.message || ''}
                          onChange={(e) => updateStep(step.id, { message: e.target.value })}
                          rows={3}
                          placeholder="Enter the message or description for this step..."
                        />
                      )}
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                          <span className="text-sm font-medium">{step.order}</span>
                        </div>
                        
                        <div className={`p-2 rounded-full ${getChannelColor(step.channel)}`}>
                          {getStepIcon(step.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{step.name}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChannelColor(step.channel)}`}>
                              {step.channel}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {step.type === 'wait' 
                              ? `Wait ${formatDelayHours(step.delay_hours)}`
                              : `After ${formatDelayHours(step.delay_hours)}`
                            }
                            {step.message && (
                              <span className="ml-2">• {step.message.substring(0, 50)}{step.message.length > 50 ? '...' : ''}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === sequence.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStep(step.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteStep(step.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Connection line to next step */}
              {index < sequence.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-px h-4 bg-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}