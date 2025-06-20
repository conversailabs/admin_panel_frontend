'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Lead } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      // Mock lead data
      const mockLeads: Lead[] = [
        {
          id: 'lead1',
          organization_id: 'org1',
          name: 'John Smith',
          email: 'john.smith@acmecorp.com',
          phone_number: '+1-555-0123',
          company: 'Acme Corporation',
          title: 'VP of Sales',
          industry: 'Technology',
          location: 'San Francisco, CA',
          lead_source: 'Website',
          status: 'new',
          tags: ['enterprise', 'high-value'],
          custom_fields: {
            company_size: '500-1000',
            budget: '$50k-100k',
            timeline: 'Q2 2024'
          },
          assigned_agent_id: 'agent1',
          created_at: '2024-06-15T10:00:00Z',
          updated_at: '2024-06-20T15:30:00Z'
        },
        {
          id: 'lead2',
          organization_id: 'org1',
          name: 'Sarah Johnson',
          email: 'sarah.j@techstart.io',
          phone_number: '+1-555-0124',
          company: 'TechStart Inc',
          title: 'CTO',
          industry: 'SaaS',
          location: 'Austin, TX',
          lead_source: 'LinkedIn',
          status: 'contacted',
          tags: ['startup', 'technical'],
          custom_fields: {
            company_size: '10-50',
            budget: '$10k-25k',
            timeline: 'Q3 2024'
          },
          created_at: '2024-06-14T14:30:00Z',
          updated_at: '2024-06-19T09:15:00Z'
        },
        {
          id: 'lead3',
          organization_id: 'org1',
          name: 'Michael Chen',
          email: 'mchen@globalmanufacturing.com',
          phone_number: '+1-555-0125',
          company: 'Global Manufacturing Ltd',
          title: 'Operations Director',
          industry: 'Manufacturing',
          location: 'Chicago, IL',
          lead_source: 'Trade Show',
          status: 'qualified',
          tags: ['manufacturing', 'enterprise'],
          custom_fields: {
            company_size: '1000+',
            budget: '$100k+',
            timeline: 'Q1 2024'
          },
          assigned_agent_id: 'agent2',
          created_at: '2024-06-10T11:20:00Z',
          updated_at: '2024-06-18T16:45:00Z'
        },
        {
          id: 'lead4',
          organization_id: 'org1',
          name: 'Emily Rodriguez',
          email: 'emily.r@retailchain.com',
          phone_number: '+1-555-0126',
          company: 'Retail Chain Solutions',
          title: 'Marketing Manager',
          industry: 'Retail',
          location: 'New York, NY',
          lead_source: 'Referral',
          status: 'interested',
          tags: ['retail', 'marketing'],
          custom_fields: {
            company_size: '200-500',
            budget: '$25k-50k',
            timeline: 'Q2 2024'
          },
          created_at: '2024-06-12T08:45:00Z',
          updated_at: '2024-06-17T13:20:00Z'
        },
        {
          id: 'lead5',
          organization_id: 'org1',
          name: 'David Thompson',
          email: 'dthompson@healthcarecorp.com',
          phone_number: '+1-555-0127',
          company: 'Healthcare Corp',
          title: 'IT Director',
          industry: 'Healthcare',
          location: 'Boston, MA',
          lead_source: 'Cold Outreach',
          status: 'not_interested',
          tags: ['healthcare', 'compliance'],
          custom_fields: {
            company_size: '500-1000',
            budget: 'TBD',
            timeline: 'Not specified'
          },
          created_at: '2024-06-08T15:10:00Z',
          updated_at: '2024-06-16T10:30:00Z'
        }
      ];
      setLeads(mockLeads);
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone_number?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.lead_source === sourceFilter);
    }

    setFilteredLeads(filtered);
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
      <Badge variant={variants[status]} size="sm">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedLeads(
      selectedLeads.length === filteredLeads.length 
        ? [] 
        : filteredLeads.map(lead => lead.id)
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on leads:`, selectedLeads);
    // Implementation for bulk actions
  };

  const getLeadStats = () => {
    const total = leads.length;
    const new_leads = leads.filter(l => l.status === 'new').length;
    const qualified = leads.filter(l => l.status === 'qualified' || l.status === 'interested').length;
    const converted = leads.filter(l => l.status === 'converted').length;
    
    return { total, new_leads, qualified, converted };
  };

  const stats = getLeadStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
        <div className="flex space-x-3">
          <Link href="/dashboard/leads/import">
            <Button variant="outline">Import Leads</Button>
          </Link>
          <Link href="/dashboard/leads/create">
            <Button>Add Lead</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Leads
            </CardTitle>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              All leads in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              New Leads
            </CardTitle>
            <div className="text-2xl font-bold">{stats.new_leads}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              Awaiting first contact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Qualified Leads
            </CardTitle>
            <div className="text-2xl font-bold">{stats.qualified}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              Ready for conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversions
            </CardTitle>
            <div className="text-2xl font-bold">{stats.converted}</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              Successfully converted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>
            Manage and track your sales leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search leads by name, email, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'interested', label: 'Interested' },
                { value: 'not_interested', label: 'Not Interested' },
                { value: 'converted', label: 'Converted' }
              ]}
            />
            <Select
              value={sourceFilter}
              onChange={setSourceFilter}
              options={[
                { value: 'all', label: 'All Sources' },
                { value: 'Website', label: 'Website' },
                { value: 'LinkedIn', label: 'LinkedIn' },
                { value: 'Trade Show', label: 'Trade Show' },
                { value: 'Referral', label: 'Referral' },
                { value: 'Cold Outreach', label: 'Cold Outreach' }
              ]}
            />
          </div>

          {/* Bulk Actions */}
          {selectedLeads.length > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('assign')}>
                  Assign Agent
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('tag')}>
                  Add Tags
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('status')}>
                  Change Status
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Leads Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleLeadSelection(lead.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        <Link href={`/dashboard/leads/${lead.id}`} className="hover:text-blue-600">
                          {lead.name}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{lead.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.company}</div>
                      <div className="text-sm text-gray-500">{lead.industry}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{lead.email}</div>
                      <div className="text-gray-500">{lead.phone_number}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">
                      {lead.lead_source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {lead.tags.length > 2 && (
                        <Badge variant="secondary" size="sm">
                          +{lead.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/leads/${lead.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                      <Link href={`/dashboard/leads/${lead.id}/edit`}>
                        <Button size="sm" variant="outline">Edit</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">No leads found matching your criteria.</div>
              <div className="mt-4">
                <Link href="/dashboard/leads/create">
                  <Button>Add Your First Lead</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}