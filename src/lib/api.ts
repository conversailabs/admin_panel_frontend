import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Get token from localStorage in client-side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle authentication errors
      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        throw new Error('Authentication required');
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(email: string, password: string, name: string, phone_number?: string) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone_number }),
    });
  }

  // Organization methods
  async createOrganization(name: string, billing_email?: string) {
    return this.request('/api/organizations/', {
      method: 'POST',
      body: JSON.stringify({ name, billing_email }),
    });
  }

  async getCurrentOrganization() {
    return this.request('/api/organizations/current');
  }

  // Agent methods
  async getAgents(limit = 50, offset = 0) {
    return this.request(`/api/agents/?limit=${limit}&offset=${offset}`);
  }

  async getAgent(agentId: string) {
    return this.request(`/api/agents/${agentId}`);
  }

  async createAgent(agentData: any) {
    return this.request('/api/agents/', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async updateAgent(agentId: string, agentData: any) {
    return this.request(`/api/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
  }

  async deleteAgent(agentId: string) {
    return this.request(`/api/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  async getVoiceProviders() {
    return this.request('/api/agents/voice-providers');
  }

  // Lead methods
  async getLeads(params: { limit?: number; offset?: number; status?: string; search?: string } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    
    const queryString = queryParams.toString();
    return this.request(`/api/leads/${queryString ? `?${queryString}` : ''}`);
  }

  async getLead(leadId: string) {
    return this.request(`/api/leads/${leadId}`);
  }

  async createLead(leadData: any) {
    return this.request('/api/leads/', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async updateLead(leadId: string, leadData: any) {
    return this.request(`/api/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  }

  // Call methods
  async initiateCall(leadId: string, agentId: string) {
    return this.request('/api/calls/initiate', {
      method: 'POST',
      body: JSON.stringify({ lead_id: leadId, agent_id: agentId, call_type: 'outbound' }),
    });
  }

  async getCalls(params: { agent_id?: string; lead_id?: string; status?: string; limit?: number; offset?: number } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    
    const queryString = queryParams.toString();
    return this.request(`/api/calls/${queryString ? `?${queryString}` : ''}`);
  }

  async getCallDetails(attemptId: string) {
    return this.request(`/api/calls/${attemptId}`);
  }

  // Content generation methods
  async generateTemplate(description: string, templateType: string, channel: string, language = 'en', agentId?: string) {
    return this.request('/api/content/generate-template', {
      method: 'POST',
      body: JSON.stringify({
        description,
        template_type: templateType,
        channel,
        language,
        agent_id: agentId,
      }),
    });
  }

  async generateYamlFromScript(scriptText: string, agentId: string, scriptType = 'sales_call') {
    return this.request('/api/content/generate-yaml', {
      method: 'POST',
      body: JSON.stringify({
        script_text: scriptText,
        agent_id: agentId,
        script_type: scriptType,
      }),
    });
  }
}

export const apiClient = new ApiClient();