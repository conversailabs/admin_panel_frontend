'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Campaign, CampaignStats } from '@/types/campaign';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadCampaigns();
    loadStats();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      // Mock data for now - will connect to API later
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          organization_id: 'org1',
          name: 'Q1 Cold Outreach',
          description: 'Cold outreach to enterprise prospects',
          status: 'active',
          type: 'cold_outreach',
          agent_id: 'agent1',
          lead_count: 500,
          completed_count: 320,
          success_count: 45,
          sequence: [],
          schedule_config: {
            timezone: 'America/New_York',
            business_hours: { start: '09:00', end: '17:00' },
            allowed_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            respect_holidays: true
          },
          created_by: 'user1',
          created_at: '2024-06-15T10:00:00Z',
          updated_at: '2024-06-20T15:30:00Z',
          started_at: '2024-06-16T09:00:00Z'
        },
        {
          id: '2',
          organization_id: 'org1',
          name: 'Lead Nurturing - SaaS',
          description: 'Nurture qualified SaaS leads',
          status: 'active',
          type: 'lead_nurturing',
          agent_id: 'agent2',
          lead_count: 250,
          completed_count: 180,
          success_count: 32,
          sequence: [],
          schedule_config: {
            timezone: 'America/New_York',
            business_hours: { start: '09:00', end: '17:00' },
            allowed_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            respect_holidays: true
          },
          created_by: 'user1',
          created_at: '2024-06-10T14:00:00Z',
          updated_at: '2024-06-20T11:15:00Z',
          started_at: '2024-06-12T09:00:00Z'
        },
        {
          id: '3',
          organization_id: 'org1',
          name: 'Event Follow-up',
          description: 'Follow up with trade show attendees',
          status: 'completed',
          type: 'event_followup',
          agent_id: 'agent1',
          lead_count: 150,
          completed_count: 150,
          success_count: 28,
          sequence: [],
          schedule_config: {
            timezone: 'America/New_York',
            business_hours: { start: '09:00', end: '17:00' },
            allowed_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            respect_holidays: true
          },
          created_by: 'user1',
          created_at: '2024-05-20T10:00:00Z',
          updated_at: '2024-06-01T16:00:00Z',
          started_at: '2024-05-22T09:00:00Z',
          ended_at: '2024-06-01T16:00:00Z'
        }
      ];
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const mockStats: CampaignStats = {
        total_campaigns: 12,
        active_campaigns: 6,
        total_leads: 2450,
        contacted_leads: 1890,
        converted_leads: 234,
        avg_response_rate: 18.5,
        top_performing_campaign: {
          id: '2',
          name: 'Lead Nurturing - SaaS',
          conversion_rate: 17.8
        }
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Campaign['status']) => {
    const variants = {
      draft: 'secondary',
      active: 'success',
      paused: 'outline',
      completed: 'default',
      cancelled: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getProgressPercentage = (campaign: Campaign) => {
    return campaign.lead_count > 0 ? Math.round((campaign.completed_count / campaign.lead_count) * 100) : 0;
  };

  const getConversionRate = (campaign: Campaign) => {
    return campaign.completed_count > 0 ? ((campaign.success_count / campaign.completed_count) * 100).toFixed(1) : '0.0';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">
            Manage your outreach campaigns and track performance
          </p>
        </div>
        <Link href="/dashboard/campaigns/create">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Campaigns
              </CardTitle>
              <div className="text-2xl font-bold">{stats.total_campaigns}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">{stats.active_campaigns} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Leads
              </CardTitle>
              <div className="text-2xl font-bold">{stats.total_leads.toLocaleString()}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">{stats.contacted_leads.toLocaleString()} contacted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conversions
              </CardTitle>
              <div className="text-2xl font-bold">{stats.converted_leads}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">{stats.avg_response_rate}% avg rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Top Performer
              </CardTitle>
              <div className="text-lg font-bold">{stats.top_performing_campaign.conversion_rate}%</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">{stats.top_performing_campaign.name}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns ({filteredCampaigns.length})</CardTitle>
          <CardDescription>
            Monitor campaign progress and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
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
                  d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125l-1.25-1.25a3.75 3.75 0 00-5.362 5.376l2.387 2.383a7.155 7.155 0 001.206.436c.586.19 1.23.016 1.695-.377a7.142 7.142 0 00.436-1.206z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No campaigns found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first campaign.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link href="/dashboard/campaigns/create">
                    <Button>Create Campaign</Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Conversion</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500">
                          {campaign.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {campaign.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{campaign.completed_count} / {campaign.lead_count}</span>
                          <span>{getProgressPercentage(campaign)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${getProgressPercentage(campaign)}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{campaign.success_count} leads</div>
                        <div className="text-gray-500">{getConversionRate(campaign)}% rate</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/dashboard/campaigns/${campaign.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}