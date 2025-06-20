'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your AI Campaign Management Platform
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Campaigns
            </CardTitle>
            <div className="text-2xl font-bold">8</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Calls Today
            </CardTitle>
            <div className="text-2xl font-bold">247</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">15 in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Leads
            </CardTitle>
            <div className="text-2xl font-bold">1,234</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">+180 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversion Rate
            </CardTitle>
            <div className="text-2xl font-bold">24.5%</div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">+2.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Launch your AI-powered campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/campaigns/create">
              <Button className="w-full justify-start" variant="default">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125l-1.25-1.25a3.75 3.75 0 00-5.362 5.376l2.387 2.383a7.155 7.155 0 001.206.436c.586.19 1.23.016 1.695-.377a7.142 7.142 0 00.436-1.206z" />
                </svg>
                Create AI Campaign
              </Button>
            </Link>
            <Link href="/dashboard/leads/import">
              <Button className="w-full justify-start" variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                Import Leads
              </Button>
            </Link>
            <Link href="/dashboard/campaigns">
              <Button className="w-full justify-start" variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Campaign "Q1 Enterprise" completed call sequence</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New lead qualified in "Demo Booking" campaign</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Campaign "Cold Outreach" started with 150 leads</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">AI agent "Sarah" achieved 35% conversion rate</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>
              Your best converting campaigns this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Q1 Enterprise Outreach</p>
                  <p className="text-sm text-gray-600">AI Agent: Sarah • 247 calls • 89 qualified</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">36.0%</p>
                  <p className="text-xs text-gray-500">conversion</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Demo Booking Campaign</p>
                  <p className="text-sm text-gray-600">AI Agent: Mike • 156 calls • 47 booked</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">30.1%</p>
                  <p className="text-xs text-gray-500">conversion</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Follow-up Nurturing</p>
                  <p className="text-sm text-gray-600">AI Agent: Emma • 89 calls • 23 closed</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">25.8%</p>
                  <p className="text-xs text-gray-500">conversion</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Templates</CardTitle>
            <CardDescription>
              Ready-to-use campaign templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-sm">Cold Outreach (3-Touch)</p>
              <p className="text-xs text-gray-600">Call → Email → Follow-up</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-sm">Lead Nurturing (5-Touch)</p>
              <p className="text-xs text-gray-600">Multi-channel sequence</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-sm">Appointment Booking</p>
              <p className="text-xs text-gray-600">Demo-focused outreach</p>
            </div>
            <Link href="/dashboard/campaigns/templates">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Browse All Templates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}