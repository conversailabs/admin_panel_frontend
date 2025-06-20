export interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  type: 'cold_outreach' | 'lead_nurturing' | 'event_followup' | 'winback' | 'custom';
  agent_id?: string;
  lead_count: number;
  completed_count: number;
  success_count: number;
  sequence: CampaignStep[];
  schedule_config: {
    timezone: string;
    business_hours: {
      start: string;
      end: string;
    };
    allowed_days: string[];
    respect_holidays: boolean;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
  started_at?: string;
  ended_at?: string;
}

export interface CampaignStep {
  id: string;
  name: string;
  type: 'call' | 'email' | 'sms' | 'wait' | 'condition';
  delay_hours: number;
  channel: 'voice' | 'email' | 'sms';
  message?: string;
  template_id?: string;
  conditions?: {
    if: string;
    then: string;
    else?: string;
  };
  order: number;
}

export interface CampaignStats {
  total_campaigns: number;
  active_campaigns: number;
  total_leads: number;
  contacted_leads: number;
  converted_leads: number;
  avg_response_rate: number;
  top_performing_campaign: {
    id: string;
    name: string;
    conversion_rate: number;
  };
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  type: Campaign['type'];
  industry?: string;
  estimatedConversionRate?: string;
  sequence: Omit<CampaignStep, 'id'>[];
  estimated_duration_days: number;
  recommended_for: string[];
}

export interface CampaignLead {
  id: string;
  campaign_id: string;
  lead_id: string;
  current_step: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'opted_out';
  last_contact_at?: string;
  next_contact_at?: string;
  response_received: boolean;
  conversion_achieved: boolean;
  notes?: string;
}

export interface CreateCampaignRequest {
  name: string;
  description: string;
  type: Campaign['type'];
  agent_id?: string;
  lead_ids: string[];
  sequence: Omit<CampaignStep, 'id'>[];
  schedule_config: Campaign['schedule_config'];
}