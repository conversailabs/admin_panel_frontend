'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { CallAttempt } from '@/types';

export default function CallDetailPage() {
  const params = useParams();
  const callId = params.id as string;
  
  const [call, setCall] = useState<CallAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);

  useEffect(() => {
    loadCallData();
  }, [callId]);

  const loadCallData = async () => {
    setLoading(true);
    try {
      // Mock call data
      const mockCall: CallAttempt = {
        id: callId,
        organization_id: 'org1',
        agent_id: 'agent1',
        lead_id: 'lead1',
        channel: 'voice',
        status: 'completed',
        outcome: 'interested',
        duration_seconds: 420,
        cost_usd: 2.10,
        retell_call_id: 'retell_123456',
        transcript: `Agent: Hello, this is Sarah from TechSolutions. Is this John Smith?

Lead: Yes, this is John. How can I help you?

Agent: Hi John, thank you for taking my call. I'm reaching out because I noticed your company, Acme Corporation, has been growing rapidly, and I wanted to share how we've helped similar companies in the technology sector streamline their sales processes. Do you have a few minutes to chat?

Lead: Sure, I have a few minutes. What kind of solutions do you offer?

Agent: We specialize in sales automation and CRM integration. Many VP of Sales like yourself have told us they're struggling with manual processes that take up too much time. Is that something you're experiencing at Acme?

Lead: Actually, yes. We're still using a lot of spreadsheets and manual tracking. It's becoming harder to manage as we scale. What kind of automation are you talking about?

Agent: Great question. Our platform can automate lead scoring, follow-up sequences, and provide real-time analytics on your sales pipeline. We've helped companies like yours reduce manual work by 60% while increasing conversion rates by 25%. Would you be interested in seeing how this would work specifically for Acme?

Lead: That sounds interesting. What would be the next steps?

Agent: I'd love to set up a brief demo tailored to your specific needs. Would next Tuesday or Wednesday work better for you? The demo takes about 30 minutes, and I can show you exactly how it would integrate with your current processes.

Lead: Tuesday afternoon would work. Let's say 2 PM?

Agent: Perfect! Tuesday at 2 PM works great. I'll send you a calendar invite with the meeting details. Is john.smith@acmecorp.com still the best email to reach you?

Lead: Yes, that's correct.

Agent: Excellent. I'll send that over within the hour. John, before we wrap up, are there any specific pain points or features you'd want me to focus on during the demo?

Lead: I'd be most interested in seeing the lead scoring and pipeline analytics features.

Agent: Noted! I'll make sure to focus on those areas. Thanks for your time today, John. I look forward to our demo on Tuesday at 2 PM.

Lead: Sounds good. Thank you, Sarah.

Agent: You're welcome! Have a great day.`,
        analysis: {
          sentiment: 'positive',
          key_points: [
            'Lead is experiencing manual process pain points',
            'Interested in automation solutions',
            'Budget appears available',
            'Decision maker confirmed (VP of Sales)',
            'Demo scheduled for Tuesday 2 PM',
            'Specific interest in lead scoring and analytics'
          ],
          next_steps: [
            'Send calendar invite for Tuesday 2 PM demo',
            'Prepare demo focusing on lead scoring and pipeline analytics',
            'Follow up with personalized proposal after demo',
            'Research Acme Corporation\'s current tech stack'
          ]
        },
        initiated_at: '2024-06-20T10:30:00Z',
        completed_at: '2024-06-20T10:37:00Z'
      };
      setCall(mockCall);
    } catch (error) {
      console.error('Failed to load call:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: CallAttempt['status']) => {
    const variants = {
      initiated: 'outline',
      in_progress: 'outline',
      completed: 'success',
      failed: 'destructive',
      no_answer: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getOutcomeBadge = (outcome?: string) => {
    if (!outcome) return null;
    
    const variants: Record<string, any> = {
      interested: 'success',
      not_interested: 'destructive',
      callback_requested: 'outline',
      voicemail: 'secondary',
      busy: 'secondary',
      qualified: 'success'
    };
    
    return (
      <Badge variant={variants[outcome] || 'outline'}>
        {outcome.replace('_', ' ')}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants: Record<string, any> = {
      positive: 'success',
      neutral: 'outline',
      negative: 'destructive'
    };
    
    return (
      <Badge variant={variants[sentiment] || 'outline'} size="sm">
        {sentiment}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Call Details</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Call Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">The call you're looking for doesn't exist.</p>
              <div className="mt-4">
                <Link href="/dashboard/calls">
                  <Button>Back to Calls</Button>
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
      {/* Call Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">{getStatusBadge(call.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Outcome</label>
                <div className="mt-1">{call.outcome ? getOutcomeBadge(call.outcome) : 'N/A'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Duration</label>
                <div className="text-lg font-medium">{formatDuration(call.duration_seconds || 0)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Cost</label>
                <div className="text-lg font-medium">${call.cost_usd?.toFixed(2) || '0.00'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Channel</label>
                <div>
                  <Badge variant="outline" size="sm">{call.channel}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Retell Call ID</label>
                <div className="text-sm font-mono">{call.retell_call_id || 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Agent</label>
              <div className="flex items-center space-x-3 mt-1">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-800">A</span>
                </div>
                <div>
                  <div className="font-medium">Agent {call.agent_id}</div>
                  <div className="text-sm text-gray-500">Sales Representative</div>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Lead</label>
              <div className="flex items-center space-x-3 mt-1">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-800">L</span>
                </div>
                <div>
                  <Link href={`/dashboard/leads/${call.lead_id}`} className="font-medium text-blue-600 hover:underline">
                    Lead {call.lead_id}
                  </Link>
                  <div className="text-sm text-gray-500">John Smith, VP of Sales</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Call Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium">Call Initiated</div>
                <div className="text-sm text-gray-500">
                  {new Date(call.initiated_at).toLocaleString()}
                </div>
              </div>
            </div>
            {call.completed_at && (
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Call Completed</div>
                  <div className="text-sm text-gray-500">
                    {new Date(call.completed_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      {call.analysis && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>
              Automated analysis of the call content and sentiment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Sentiment</label>
              <div className="mt-1">{getSentimentBadge(call.analysis.sentiment)}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Key Points</label>
              <ul className="mt-2 space-y-1">
                {call.analysis.key_points.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Next Steps</label>
              <ul className="mt-2 space-y-1">
                {call.analysis.next_steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const transcriptTab = (
    <Card>
      <CardHeader>
        <CardTitle>Call Transcript</CardTitle>
        <CardDescription>
          Full conversation transcript with speaker identification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {call.transcript ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className={`whitespace-pre-wrap text-sm leading-relaxed ${
                transcriptExpanded ? '' : 'max-h-96 overflow-hidden'
              }`}>
                {call.transcript.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    {paragraph.split('\n').map((line, lineIndex) => {
                      const isAgent = line.startsWith('Agent:');
                      const isLead = line.startsWith('Lead:');
                      
                      if (isAgent) {
                        return (
                          <div key={lineIndex} className="flex items-start space-x-3 mb-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-blue-800">A</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-blue-800">Agent</div>
                              <div className="text-sm">{line.replace('Agent: ', '')}</div>
                            </div>
                          </div>
                        );
                      } else if (isLead) {
                        return (
                          <div key={lineIndex} className="flex items-start space-x-3 mb-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-green-800">L</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-green-800">Lead</div>
                              <div className="text-sm">{line.replace('Lead: ', '')}</div>
                            </div>
                          </div>
                        );
                      } else if (line.trim()) {
                        return (
                          <div key={lineIndex} className="text-sm text-gray-600 ml-9 mb-1">
                            {line}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
              
              {!transcriptExpanded && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTranscriptExpanded(true)}
                  >
                    Show Full Transcript
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                Transcript generated automatically by AI
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No transcript available for this call.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const recordingTab = (
    <Card>
      <CardHeader>
        <CardTitle>Call Recording</CardTitle>
        <CardDescription>
          Audio recording of the call (if available)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <div className="mt-4">
            <div className="text-gray-500">Recording not available</div>
            <div className="text-sm text-gray-400 mt-1">
              Call recordings are retained for 30 days
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', content: overviewTab },
    { id: 'transcript', label: 'Transcript', content: transcriptTab },
    { id: 'recording', label: 'Recording', content: recordingTab },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/calls">
            <Button variant="outline" size="sm">← Back</Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Call Details</h1>
            <p className="text-gray-600">Call ID: {call.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(call.status)}
          {call.outcome && getOutcomeBadge(call.outcome)}
          <Button variant="outline">Export Call Data</Button>
        </div>
      </div>

      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}