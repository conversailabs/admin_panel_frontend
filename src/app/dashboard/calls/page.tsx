'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { CallAttempt } from '@/types';

export default function CallsPage() {
  const [calls, setCalls] = useState<CallAttempt[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<CallAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadCalls();
  }, []);

  useEffect(() => {
    filterCalls();
  }, [calls, searchTerm, statusFilter, channelFilter, dateFilter]);

  const loadCalls = async () => {
    setLoading(true);
    try {
      // Mock call data
      const mockCalls: CallAttempt[] = [
        {
          id: 'call1',
          organization_id: 'org1',
          agent_id: 'agent1',
          lead_id: 'lead1',
          channel: 'voice',
          status: 'completed',
          outcome: 'interested',
          duration_seconds: 420,
          cost_usd: 2.10,
          retell_call_id: 'retell_123',
          transcript: 'Agent: Hello John, this is Sarah from TechSolutions...',
          analysis: {
            sentiment: 'positive',
            key_points: ['Interested in automation', 'Budget available Q2', 'Decision maker confirmed'],
            next_steps: ['Send pricing proposal', 'Schedule demo', 'Follow up in 3 days']
          },
          initiated_at: '2024-06-20T10:30:00Z',
          completed_at: '2024-06-20T10:37:00Z'
        },
        {
          id: 'call2',
          organization_id: 'org1',
          agent_id: 'agent2',
          lead_id: 'lead2',
          channel: 'voice',
          status: 'in_progress',
          duration_seconds: 180,
          cost_usd: 0.90,
          retell_call_id: 'retell_124',
          initiated_at: '2024-06-20T15:45:00Z'
        },
        {
          id: 'call3',
          organization_id: 'org1',
          agent_id: 'agent1',
          lead_id: 'lead3',
          channel: 'voice',
          status: 'completed',
          outcome: 'not_interested',
          duration_seconds: 85,
          cost_usd: 0.50,
          retell_call_id: 'retell_125',
          transcript: 'Agent: Hello Michael, this is Sarah calling about...',
          analysis: {
            sentiment: 'negative',
            key_points: ['Not interested in current solution', 'Already has vendor', 'Budget constraints'],
            next_steps: ['Mark as not interested', 'Follow up in 6 months']
          },
          initiated_at: '2024-06-20T14:15:00Z',
          completed_at: '2024-06-20T14:16:25Z'
        },
        {
          id: 'call4',
          organization_id: 'org1',
          agent_id: 'agent2',
          lead_id: 'lead4',
          channel: 'voice',
          status: 'failed',
          initiated_at: '2024-06-20T09:20:00Z',
          completed_at: '2024-06-20T09:20:30Z'
        },
        {
          id: 'call5',
          organization_id: 'org1',
          agent_id: 'agent1',
          lead_id: 'lead5',
          channel: 'voice',
          status: 'no_answer',
          initiated_at: '2024-06-20T11:45:00Z',
          completed_at: '2024-06-20T11:46:00Z'
        },
        {
          id: 'call6',
          organization_id: 'org1',
          agent_id: 'agent2',
          lead_id: 'lead6',
          channel: 'voice',
          status: 'completed',
          outcome: 'callback_requested',
          duration_seconds: 125,
          cost_usd: 0.75,
          retell_call_id: 'retell_126',
          transcript: 'Agent: Hi Emily, this is Alex from TechSolutions...',
          analysis: {
            sentiment: 'neutral',
            key_points: ['Requested callback next week', 'Interested but busy', 'Good timing in Q3'],
            next_steps: ['Schedule callback for next Tuesday', 'Send information packet']
          },
          initiated_at: '2024-06-20T13:30:00Z',
          completed_at: '2024-06-20T13:32:05Z'
        }
      ];
      setCalls(mockCalls);
    } catch (error) {
      console.error('Failed to load calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCalls = () => {
    let filtered = calls;

    if (searchTerm) {
      filtered = filtered.filter(call =>
        call.lead_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.agent_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.retell_call_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.status === statusFilter);
    }

    if (channelFilter !== 'all') {
      filtered = filtered.filter(call => call.channel === channelFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          filterDate.setFullYear(1970);
      }
      
      filtered = filtered.filter(call => 
        new Date(call.initiated_at) >= filterDate
      );
    }

    setFilteredCalls(filtered);
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
      <Badge variant={variants[status]} size="sm">
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
      <Badge variant={variants[outcome] || 'outline'} size="sm">
        {outcome.replace('_', ' ')}
      </Badge>
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCallStats = () => {
    const total = calls.length;
    const completed = calls.filter(c => c.status === 'completed').length;
    const inProgress = calls.filter(c => c.status === 'in_progress').length;
    const failed = calls.filter(c => c.status === 'failed' || c.status === 'no_answer').length;
    const totalCost = calls.reduce((sum, call) => sum + (call.cost_usd || 0), 0);
    const totalDuration = calls.reduce((sum, call) => sum + (call.duration_seconds || 0), 0);
    
    return { total, completed, inProgress, failed, totalCost, totalDuration };
  };

  const stats = getCallStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Call Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const realtimeTab = (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Calls
            </CardTitle>
            <div className="text-2xl font-bold text-green-600">{stats.inProgress}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Today
            </CardTitle>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Failed Calls
            </CardTitle>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Failed or no answer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Cost
            </CardTitle>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Today's spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Talk Time
            </CardTitle>
            <div className="text-2xl font-bold">{Math.floor(stats.totalDuration / 60)}m</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Total duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Calls */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <CardTitle>Active Calls</CardTitle>
          </div>
          <CardDescription>
            Calls currently in progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.filter(call => call.status === 'in_progress').map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <div className="font-medium">Agent {call.agent_id}</div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/leads/${call.lead_id}`} className="text-blue-600 hover:underline">
                      Lead {call.lead_id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">
                      {formatDuration(call.duration_seconds)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">
                      {call.channel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(call.initiated_at).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Monitor
                      </Button>
                      <Button size="sm" variant="destructive">
                        End Call
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {calls.filter(call => call.status === 'in_progress').length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">No active calls at the moment.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const historyTab = (
    <Card>
      <CardHeader>
        <CardTitle>Call History</CardTitle>
        <CardDescription>
          Complete history of all calls made by your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by lead, agent, or call ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'completed', label: 'Completed' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'failed', label: 'Failed' },
              { value: 'no_answer', label: 'No Answer' }
            ]}
          />
          <Select
            value={channelFilter}
            onChange={setChannelFilter}
            options={[
              { value: 'all', label: 'All Channels' },
              { value: 'voice', label: 'Voice' },
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' }
            ]}
          />
          <Select
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' }
            ]}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalls.map((call) => (
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
                  <div className="font-medium">Agent {call.agent_id}</div>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/leads/${call.lead_id}`} className="text-blue-600 hover:underline">
                    Lead {call.lead_id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" size="sm">
                    {call.channel}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(call.status)}
                </TableCell>
                <TableCell>
                  {formatDuration(call.duration_seconds)}
                </TableCell>
                <TableCell>
                  {getOutcomeBadge(call.outcome)}
                </TableCell>
                <TableCell>
                  {call.cost_usd ? `$${call.cost_usd.toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/calls/${call.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
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

        {filteredCalls.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No calls found matching your criteria.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const analyticsTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium">
                  {((stats.completed / stats.total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Duration</span>
                <span className="font-medium">
                  {formatDuration(Math.floor(stats.totalDuration / stats.total))}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Cost per Call</span>
                <span className="font-medium">
                  ${(stats.totalCost / stats.total).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Interested</span>
                <Badge variant="success" size="sm">
                  {calls.filter(c => c.outcome === 'interested').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Not Interested</span>
                <Badge variant="destructive" size="sm">
                  {calls.filter(c => c.outcome === 'not_interested').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Callback Requested</span>
                <Badge variant="outline" size="sm">
                  {calls.filter(c => c.outcome === 'callback_requested').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">No Answer</span>
                <Badge variant="secondary" size="sm">
                  {calls.filter(c => c.status === 'no_answer').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const tabs = [
    { id: 'realtime', label: 'Real-time', content: realtimeTab },
    { id: 'history', label: 'Call History', content: historyTab },
    { id: 'analytics', label: 'Analytics', content: analyticsTab },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Call Management</h1>
        <div className="flex space-x-3">
          <Button variant="outline">Export Data</Button>
          <Button>Start Campaign</Button>
        </div>
      </div>

      <Tabs tabs={tabs} defaultTab="realtime" />
    </div>
  );
}