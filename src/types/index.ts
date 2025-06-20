// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone_number?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  org_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  org_id?: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone_number?: string;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  max_calls_per_day: number;
  max_minutes_per_day: number;
  max_attempts_per_lead: number;
  subscription_tier: string;
  billing_email?: string;
  created_at: string;
  updated_at: string;
}

// Agent Types
export interface Agent {
  id: string;
  organization_id: string;
  name: string;
  identity_name: string;
  identity_org: string;
  identity_role: string;
  language: string;
  enabled_channels: ('voice' | 'email' | 'sms')[];
  voice_provider: string;
  voice_id: string;
  voice_settings: {
    speed: number;
    pitch: number;
  };
  prompt_config: {
    objectives: string[];
    instructions: string;
  };
  llm_config: {
    model: string;
    temperature: number;
    max_tokens: number;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentRequest {
  name: string;
  identity_name: string;
  identity_role: string;
  identity_org: string;
  language: string;
  enabled_channels: ('voice' | 'email' | 'sms')[];
  voice_provider: string;
  voice_id: string;
  prompt_config: {
    objectives: string[];
    instructions: string;
  };
  llm_config: {
    model: string;
    temperature: number;
    max_tokens: number;
  };
  voice_settings: {
    speed: number;
    pitch: number;
  };
}

// Lead Types
export interface Lead {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone_number?: string;
  company?: string;
  title?: string;
  industry?: string;
  location?: string;
  lead_source: string;
  status: 'new' | 'contacted' | 'qualified' | 'interested' | 'not_interested' | 'converted';
  tags: string[];
  custom_fields: Record<string, any>;
  assigned_agent_id?: string;
  created_at: string;
  updated_at: string;
}

// Call Types
export interface CallAttempt {
  id: string;
  organization_id: string;
  agent_id: string;
  lead_id: string;
  channel: 'voice' | 'email' | 'sms';
  status: 'initiated' | 'in_progress' | 'completed' | 'failed' | 'no_answer';
  outcome?: string;
  duration_seconds?: number;
  cost_usd?: number;
  retell_call_id?: string;
  transcript?: string;
  analysis?: {
    sentiment: string;
    key_points: string[];
    next_steps: string[];
  };
  initiated_at: string;
  completed_at?: string;
}

// Voice Provider Types
export interface VoiceProvider {
  id: string;
  provider: string;
  voice_id: string;
  voice_name: string;
  language: string;
  gender: string;
  accent: string;
  style: string;
  is_active: boolean;
}

// Export campaign types
export * from './campaign';