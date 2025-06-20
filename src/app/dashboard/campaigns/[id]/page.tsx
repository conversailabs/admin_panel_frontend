'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Campaign, CampaignLead } from '@/types/campaign';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignLeads, setCampaignLeads] = useState<CampaignLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaignData();
  }, [campaignId]);

  const loadCampaignData = async () => {
    setLoading(true);
    try {
      // Mock campaign data
      const mockCampaign: Campaign = {
        id: campaignId,
        organization_id: 'org1',
        name: 'Q1 Cold Outreach',
        description: 'Cold outreach to enterprise prospects for Q1 pipeline building',
        status: 'active',
        type: 'cold_outreach',
        agent_id: 'agent1',
        lead_count: 500,
        completed_count: 320,
        success_count: 45,
        sequence: [
          {
            id: 'step1',
            name: 'Initial Call',
            type: 'call',
            delay_hours: 0,
            channel: 'voice',
            message: 'Introduction and value proposition',
            order: 1
          },
          {
            id: 'step2',
            name: 'Wait Period',
            type: 'wait',
            delay_hours: 24,
            channel: 'voice',
            order: 2
          },
          {
            id: 'step3',
            name: 'Follow-up Email',
            type: 'email',
            delay_hours: 0,
            channel: 'email',
            message: 'Thank you for your time, here are the details we discussed',
            order: 3
          }
        ],
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
      };
      setCampaign(mockCampaign);

      // Mock campaign leads
      const mockLeads: CampaignLead[] = [
        {
          id: 'cl1',
          campaign_id: campaignId,
          lead_id: 'lead1',
          current_step: 1,
          status: 'completed',
          last_contact_at: '2024-06-20T10:30:00Z',
          response_received: true,
          conversion_achieved: true,
          notes: 'Interested in Q3 implementation'
        },
        {
          id: 'cl2',
          campaign_id: campaignId,
          lead_id: 'lead2',
          current_step: 2,
          status: 'in_progress',
          last_contact_at: '2024-06-19T14:15:00Z',
          next_contact_at: '2024-06-21T09:00:00Z',
          response_received: false,
          conversion_achieved: false
        },
        {
          id: 'cl3',
          campaign_id: campaignId,
          lead_id: 'lead3',
          current_step: 3,
          status: 'completed',
          last_contact_at: '2024-06-18T11:45:00Z',
          response_received: true,
          conversion_achieved: false,
          notes: 'Not interested at this time'
        }
      ];
      setCampaignLeads(mockLeads);
    } catch (error) {
      console.error('Failed to load campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const pauseCampaign = async () => {
    // Implementation to pause campaign
    console.log('Pausing campaign:', campaignId);
  };

  const resumeCampaign = async () => {
    // Implementation to resume campaign
    console.log('Resuming campaign:', campaignId);
  };

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

  const getProgressPercentage = () => {
    if (!campaign || campaign.lead_count === 0) return 0;
    return Math.round((campaign.completed_count / campaign.lead_count) * 100);
  };

  const getConversionRate = () => {
    if (!campaign || campaign.completed_count === 0) return '0.0';
    return ((campaign.success_count / campaign.completed_count) * 100).toFixed(1);
  };

  const getLeadStatusBadge = (status: CampaignLead['status']) => {
    const variants = {
      pending: 'secondary',
      in_progress: 'outline',
      completed: 'success',
      failed: 'destructive',
      opted_out: 'destructive'
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
          <h1 className="text-3xl font-bold text-gray-900">Campaign Details</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Campaign Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">The campaign you're looking for doesn't exist.</p>
              <div className="mt-4">
                <Link href="/dashboard/campaigns">
                  <Button>Back to Campaigns</Button>
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Leads
            </CardTitle>
            <div className="text-2xl font-bold">{campaign.lead_count}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Enrolled in campaign</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Progress
            </CardTitle>
            <div className="text-2xl font-bold">{getProgressPercentage()}%</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">{campaign.completed_count} / {campaign.lead_count} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversions
            </CardTitle>
            <div className="text-2xl font-bold">{campaign.success_count}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">{getConversionRate()}% conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Response Rate
            </CardTitle>
            <div className="text-2xl font-bold">72%</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Leads responded</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Completed: {campaign.completed_count}</span>
              <span>Remaining: {campaign.lead_count - campaign.completed_count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${getProgressPercentage()}%` }}
              >
                {getProgressPercentage()}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sequence Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Sequence</CardTitle>
          <CardDescription>
            {campaign.sequence.length} steps configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaign.sequence.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {step.order}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-sm text-gray-500">
                    {step.type === 'wait' 
                      ? `Wait ${step.delay_hours}h`
                      : `${step.channel} • After ${step.delay_hours}h`
                    }
                  </div>
                </div>
                <Badge variant="outline">
                  {step.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const leadsTab = (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Leads</CardTitle>
        <CardDescription>
          Track individual lead progress through the campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Current Step</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Next Contact</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Converted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaignLeads.map((campaignLead) => (
              <TableRow key={campaignLead.id}>
                <TableCell>
                  <div className="font-medium">Lead {campaignLead.lead_id}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Step {campaignLead.current_step}</span>
                    <Badge variant="outline" size="sm">
                      {campaign.sequence.find(s => s.order === campaignLead.current_step)?.name || 'Unknown'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {getLeadStatusBadge(campaignLead.status)}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {campaignLead.last_contact_at 
                    ? new Date(campaignLead.last_contact_at).toLocaleDateString()
                    : 'Never'
                  }
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {campaignLead.next_contact_at 
                    ? new Date(campaignLead.next_contact_at).toLocaleDateString()
                    : 'N/A'
                  }
                </TableCell>
                <TableCell>
                  <Badge variant={campaignLead.response_received ? 'success' : 'secondary'} size="sm">
                    {campaignLead.response_received ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={campaignLead.conversion_achieved ? 'success' : 'secondary'} size="sm">
                    {campaignLead.conversion_achieved ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const analyticsTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaign.sequence.map((step) => (
                <div key={step.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{step.name}</div>
                    <div className="text-sm text-gray-500">{step.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">85%</div>
                    <div className="text-sm text-gray-500">completion</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Calls Made</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Emails Sent</span>
                <span className="font-medium">32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">SMS Sent</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Responses</span>
                <span className="font-medium">28</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', content: overviewTab },
    { id: 'leads', label: 'Leads', content: leadsTab },
    { id: 'analytics', label: 'Analytics', content: analyticsTab },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/campaigns">
              <Button variant="outline" size="sm">
                ← Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
              <p className="text-gray-600">{campaign.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(campaign.status)}
          {campaign.status === 'active' ? (
            <Button variant="outline" onClick={pauseCampaign}>
              Pause Campaign
            </Button>
          ) : campaign.status === 'paused' ? (
            <Button onClick={resumeCampaign}>
              Resume Campaign
            </Button>
          ) : null}
          <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
            <Button variant="outline">Edit Campaign</Button>
          </Link>
        </div>
      </div>

      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}