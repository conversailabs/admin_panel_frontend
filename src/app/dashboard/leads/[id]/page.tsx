'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Lead, CallAttempt } from '@/types';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [callHistory, setCallHistory] = useState<CallAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadLeadData();
  }, [leadId]);

  const loadLeadData = async () => {
    setLoading(true);
    try {
      // Mock lead data
      const mockLead: Lead = {
        id: leadId,
        organization_id: 'org1',
        name: 'John Smith',
        email: 'john.smith@acmecorp.com',
        phone_number: '+1-555-0123',
        company: 'Acme Corporation',
        title: 'VP of Sales',
        industry: 'Technology',
        location: 'San Francisco, CA',
        lead_source: 'Website',
        status: 'qualified',
        tags: ['enterprise', 'high-value', 'decision-maker'],
        custom_fields: {
          company_size: '500-1000',
          budget: '$50k-100k',
          timeline: 'Q2 2024',
          pain_points: 'Manual processes, lack of automation',
          decision_process: '3-person committee',
          notes: [
            {
              id: 'note1',
              content: 'Initial call went well. Showed strong interest in automation features.',
              created_at: '2024-06-18T10:30:00Z',
              created_by: 'agent1'
            },
            {
              id: 'note2',
              content: 'Follow-up scheduled for next week to discuss pricing.',
              created_at: '2024-06-19T14:15:00Z',
              created_by: 'user1'
            }
          ]
        },
        assigned_agent_id: 'agent1',
        created_at: '2024-06-15T10:00:00Z',
        updated_at: '2024-06-20T15:30:00Z'
      };
      setLead(mockLead);

      // Mock call history
      const mockCalls: CallAttempt[] = [
        {
          id: 'call1',
          organization_id: 'org1',
          agent_id: 'agent1',
          lead_id: leadId,
          channel: 'voice',
          status: 'completed',
          outcome: 'interested',
          duration_seconds: 420,
          cost_usd: 2.10,
          transcript: 'Agent: Hello John, this is Sarah from TechSolutions...\nLead: Hi Sarah, thanks for calling. I\'ve been looking into automation solutions...',
          analysis: {
            sentiment: 'positive',
            key_points: ['Interested in automation', 'Budget available Q2', 'Decision maker confirmed'],
            next_steps: ['Send pricing proposal', 'Schedule demo', 'Follow up in 3 days']
          },
          initiated_at: '2024-06-18T10:30:00Z',
          completed_at: '2024-06-18T10:37:00Z'
        },
        {
          id: 'call2',
          organization_id: 'org1',
          agent_id: 'agent1',
          lead_id: leadId,
          channel: 'voice',
          status: 'completed',
          outcome: 'follow_up_scheduled',
          duration_seconds: 315,
          cost_usd: 1.75,
          transcript: 'Agent: Hi John, following up on our conversation...\nLead: Yes, I reviewed the information you sent...',
          analysis: {
            sentiment: 'neutral',
            key_points: ['Reviewed proposal', 'Needs time to discuss with team', 'Price concerns mentioned'],
            next_steps: ['Address pricing concerns', 'Provide ROI calculator', 'Schedule team demo']
          },
          initiated_at: '2024-06-20T14:00:00Z',
          completed_at: '2024-06-20T14:05:00Z'
        }
      ];
      setCallHistory(mockCalls);
    } catch (error) {
      console.error('Failed to load lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (newStatus: Lead['status']) => {
    if (!lead) return;
    
    setSaving(true);
    try {
      // Mock API call
      setLead({ ...lead, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = async () => {
    if (!lead || !newTag.trim()) return;
    
    const updatedTags = [...lead.tags, newTag.trim()];
    setLead({ ...lead, tags: updatedTags });
    setNewTag('');
  };

  const removeTag = async (tagToRemove: string) => {
    if (!lead) return;
    
    const updatedTags = lead.tags.filter(tag => tag !== tagToRemove);
    setLead({ ...lead, tags: updatedTags });
  };

  const addNote = async () => {
    if (!lead || !newNote.trim()) return;
    
    const newNoteObj = {
      id: `note_${Date.now()}`,
      content: newNote.trim(),
      created_at: new Date().toISOString(),
      created_by: 'current_user'
    };
    
    const notes = lead.custom_fields.notes || [];
    const updatedCustomFields = {
      ...lead.custom_fields,
      notes: [newNoteObj, ...notes]
    };
    
    setLead({ ...lead, custom_fields: updatedCustomFields });
    setNewNote('');
  };

  const getStatusBadge = (status: Lead['status']) => {
    const variants = {
      new: 'default',
      contacted: 'outline',
      qualified: 'success',
      interested: 'success',
      not_interested: 'destructive',
      converted: 'success'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getCallStatusBadge = (status: CallAttempt['status']) => {
    const variants = {
      initiated: 'outline',
      in_progress: 'outline',
      completed: 'success',
      failed: 'destructive',
      no_answer: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status]} size="sm">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Lead Details</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Lead Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">The lead you're looking for doesn't exist.</p>
              <div className="mt-4">
                <Link href="/dashboard/leads">
                  <Button>Back to Leads</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overviewTab = (
    <div className="space-y-6">
      {/* Lead Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <div className="text-lg font-medium">{lead.name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div>{lead.email || 'Not provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <div>{lead.phone_number || 'Not provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <div>{lead.location || 'Not provided'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Company</label>
              <div className="text-lg font-medium">{lead.company || 'Not provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Title</label>
              <div>{lead.title || 'Not provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Industry</label>
              <div>{lead.industry || 'Not provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Company Size</label>
              <div>{lead.custom_fields.company_size || 'Not provided'}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status and Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">Current Status:</span>
              {getStatusBadge(lead.status)}
            </div>
            <div>
              <Select
                label="Update Status"
                value={lead.status}
                onChange={updateLeadStatus}
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'qualified', label: 'Qualified' },
                  { value: 'interested', label: 'Interested' },
                  { value: 'not_interested', label: 'Not Interested' },
                  { value: 'converted', label: 'Converted' }
                ]}
                disabled={saving}
              />
            </div>
            <div className="text-sm text-gray-500">
              <div>Lead Source: <span className="font-medium">{lead.lead_source}</span></div>
              <div>Created: {new Date(lead.created_at).toLocaleDateString()}</div>
              <div>Updated: {new Date(lead.updated_at).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag) => (
                <div key={tag} className="flex items-center space-x-1">
                  <Badge variant="secondary" size="sm">{tag}</Badge>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-red-500 hover:text-red-700 text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add new tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
              />
              <Button size="sm" onClick={addTag} disabled={!newTag.trim()}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Budget</label>
              <div>{lead.custom_fields.budget || 'Not specified'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Timeline</label>
              <div>{lead.custom_fields.timeline || 'Not specified'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Decision Process</label>
              <div>{lead.custom_fields.decision_process || 'Not specified'}</div>
            </div>
          </div>
          {lead.custom_fields.pain_points && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600">Pain Points</label>
              <div className="mt-1">{lead.custom_fields.pain_points}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const callHistoryTab = (
    <Card>
      <CardHeader>
        <CardTitle>Call History</CardTitle>
        <CardDescription>
          Complete history of all calls made to this lead
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callHistory.map((call) => (
              <TableRow key={call.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {new Date(call.initiated_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(call.initiated_at).toLocaleTimeString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" size="sm">
                    {call.channel}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getCallStatusBadge(call.status)}
                </TableCell>
                <TableCell>
                  {call.duration_seconds 
                    ? `${Math.floor(call.duration_seconds / 60)}:${(call.duration_seconds % 60).toString().padStart(2, '0')}`
                    : 'N/A'
                  }
                </TableCell>
                <TableCell>
                  {call.outcome ? (
                    <Badge variant="outline" size="sm">
                      {call.outcome.replace('_', ' ')}
                    </Badge>
                  ) : 'N/A'}
                </TableCell>
                <TableCell>
                  {call.cost_usd ? `$${call.cost_usd.toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {call.transcript && (
                      <Button size="sm" variant="outline">
                        Transcript
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {callHistory.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No calls made to this lead yet.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const notesTab = (
    <Card>
      <CardHeader>
        <CardTitle>Notes & Activities</CardTitle>
        <CardDescription>
          Internal notes and activity history for this lead
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <Textarea
            placeholder="Add a note about this lead..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" onClick={addNote} disabled={!newNote.trim()}>
              Add Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {(lead.custom_fields.notes || []).map((note: any) => (
            <div key={note.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-500">
                  {new Date(note.created_at).toLocaleString()}
                </div>
                <Badge variant="outline" size="sm">
                  {note.created_by}
                </Badge>
              </div>
              <div className="text-gray-900">{note.content}</div>
            </div>
          ))}
        </div>

        {(!lead.custom_fields.notes || lead.custom_fields.notes.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No notes yet. Add the first note above.
          </div>
        )}
      </CardContent>
    </Card>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', content: overviewTab },
    { id: 'calls', label: 'Call History', content: callHistoryTab },
    { id: 'notes', label: 'Notes', content: notesTab },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/leads">
            <Button variant="outline" size="sm">← Back</Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600">{lead.title} at {lead.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(lead.status)}
          <Button variant="outline">Call Lead</Button>
          <Link href={`/dashboard/leads/${lead.id}/edit`}>
            <Button variant="outline">Edit Lead</Button>
          </Link>
          <Button>Add to Campaign</Button>
        </div>
      </div>

      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}