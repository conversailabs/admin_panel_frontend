import { CampaignTemplate } from '@/types/campaign';

// Agent Persona Templates for different industries
export const AGENT_PERSONA_TEMPLATES = {
  // Real Estate
  realEstateAgent: {
    name: "Emma",
    voice: "en-us-female",
    greetingMessage: "Hi {lead_name}, this is Emma from {organization}. I hope I'm catching you at a good time!",
    conversationScript: `# Real Estate Lead Qualification Agent
identity:
  name: "Emma"
  role: "Real Estate Specialist"
  organization: "{organization}"

greeting: "Hi {lead_name}, this is Emma from {organization}. I hope I'm catching you at a good time!"

intro_optin: "I saw you were interested in properties in the area. I'd love to help you find your perfect home. Can I ask you a few quick questions?"

flow:
  - id: q1
    type: question
    text: "Are you currently looking to buy or sell a property?"
    entity: intent
    followups:
      - "That's great! What's your timeline for this?"
  
  - id: q2
    type: question
    text: "What's your preferred area or neighborhood?"
    entity: preferred_location
    followups:
      - "I know that area well - it's a fantastic choice!"
  
  - id: q3
    type: question
    text: "What's your budget range?"
    entity: budget_range
    followups:
      - "That's a good range for that area. We have some great options."

closing: "Perfect! I'll send you some listings that match your criteria. When would be a good time for us to schedule a viewing?"`
  },

  // SaaS Sales
  saasSDR: {
    name: "Alex",
    voice: "en-us-male",
    greetingMessage: "Hi {lead_name}, this is Alex from {organization}. How's your day going?",
    conversationScript: `# SaaS Lead Qualification Agent
identity:
  name: "Alex"
  role: "Sales Development Representative"
  organization: "{organization}"

greeting: "Hi {lead_name}, this is Alex from {organization}. How's your day going?"

intro_optin: "I noticed you downloaded our guide on sales automation. I'd love to learn more about your current sales process and see if we can help. Do you have 2 minutes?"

flow:
  - id: q1
    type: question
    text: "How many sales reps are on your team currently?"
    entity: team_size
    followups:
      - "That's a good size team. Are you looking to scale further?"
  
  - id: q2
    type: question
    text: "What's your biggest challenge with lead generation right now?"
    entity: pain_point
    followups:
      - "That's exactly what we help companies solve."
  
  - id: q3
    type: question
    text: "How are you currently tracking and managing your sales pipeline?"
    entity: current_tools
    followups:
      - "I see. How's that working for you?"

closing: "Based on what you've shared, I think our platform could really help. Would you be interested in a 15-minute demo this week?"`
  },

  // Insurance
  insuranceAgent: {
    name: "Michael",
    voice: "en-us-male",
    greetingMessage: "Hello {lead_name}, this is Michael from {organization}. I hope you're having a great day!",
    conversationScript: `# Insurance Lead Qualification Agent
identity:
  name: "Michael"
  role: "Insurance Specialist"
  organization: "{organization}"

greeting: "Hello {lead_name}, this is Michael from {organization}. I hope you're having a great day!"

intro_optin: "I'm calling because you requested information about life insurance coverage. I'd love to help you find the right protection for your family. Can I ask a few questions?"

flow:
  - id: q1
    type: question
    text: "What prompted you to look into life insurance at this time?"
    entity: motivation
    followups:
      - "That's very responsible of you to think about your family's future."
  
  - id: q2
    type: question
    text: "Do you currently have any life insurance coverage?"
    entity: current_coverage
    followups:
      - "I see. How much coverage do you currently have?"
  
  - id: q3
    type: question
    text: "What amount of coverage are you considering?"
    entity: desired_coverage
    followups:
      - "That sounds like a good amount for your situation."

closing: "I'd love to prepare some personalized quotes for you. When would be a good time for a brief 10-minute call to go over your options?"`
  },

  // Healthcare
  healthcareScheduler: {
    name: "Sarah",
    voice: "en-us-female",
    greetingMessage: "Hi {lead_name}, this is Sarah calling from {organization}. How are you feeling today?",
    conversationScript: `# Healthcare Appointment Scheduler
identity:
  name: "Sarah"
  role: "Patient Care Coordinator"
  organization: "{organization}"

greeting: "Hi {lead_name}, this is Sarah calling from {organization}. How are you feeling today?"

intro_optin: "I'm calling to follow up on your inquiry about our services. I'd like to help you schedule an appointment that works with your schedule."

flow:
  - id: q1
    type: question
    text: "What type of appointment are you looking to schedule?"
    entity: appointment_type
    followups:
      - "We have excellent specialists for that."
  
  - id: q2
    type: question
    text: "Do you have any preferred days of the week that work better for you?"
    entity: preferred_days
    followups:
      - "Perfect, that gives us good flexibility."
  
  - id: q3
    type: question
    text: "Would you prefer morning or afternoon appointments?"
    entity: time_preference

closing: "Great! I'll check our availability and get back to you with some appointment options within the next hour."`
  }
};

// Comprehensive Campaign Templates Library
export const CAMPAIGN_TEMPLATES_LIBRARY: CampaignTemplate[] = [
  // REAL ESTATE TEMPLATES
  {
    id: 'real_estate_buyer_leads',
    name: 'Real Estate - Buyer Lead Nurturing',
    description: 'Convert property inquiries into qualified buyer appointments',
    type: 'lead_nurturing',
    industry: 'Real Estate',
    estimatedConversionRate: '25-35%',
    estimated_duration_days: 7,
    recommended_for: ['Property inquiries', 'Buyer leads', 'Open house attendees'],
    sequence: [
      {
        name: 'Initial Qualification Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Qualify buyer intent and schedule viewing',
        order: 1
      },
      {
        name: 'Property Recommendations Email',
        type: 'email',
        delay_hours: 2,
        channel: 'email',
        message: 'Send personalized property listings',
        order: 2
      },
      {
        name: 'Follow-up Call',
        type: 'call',
        delay_hours: 48,
        channel: 'voice',
        message: 'Discuss properties and schedule viewings',
        order: 3
      },
      {
        name: 'Market Update SMS',
        type: 'sms',
        delay_hours: 96,
        channel: 'sms',
        message: 'New properties matching your criteria',
        order: 4
      },
      {
        name: 'Final Follow-up Call',
        type: 'call',
        delay_hours: 168,
        channel: 'voice',
        message: 'Close for viewing appointment',
        order: 5
      }
    ]
  },

  {
    id: 'real_estate_seller_leads',
    name: 'Real Estate - Seller Lead Conversion',
    description: 'Convert property valuation requests into listing agreements',
    type: 'cold_outreach',
    industry: 'Real Estate',
    estimatedConversionRate: '20-30%',
    estimated_duration_days: 5,
    recommended_for: ['Home valuation requests', 'Seller inquiries', 'Expired listings'],
    sequence: [
      {
        name: 'Market Analysis Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Discuss property value and market conditions',
        order: 1
      },
      {
        name: 'Comparative Market Analysis Email',
        type: 'email',
        delay_hours: 4,
        channel: 'email',
        message: 'Detailed CMA report and pricing strategy',
        order: 2
      },
      {
        name: 'Marketing Strategy Call',
        type: 'call',
        delay_hours: 72,
        channel: 'voice',
        message: 'Present marketing plan and listing strategy',
        order: 3
      }
    ]
  },

  // SAAS TEMPLATES
  {
    id: 'saas_free_trial',
    name: 'SaaS - Free Trial to Paid Conversion',
    description: 'Convert free trial users to paid subscribers',
    type: 'lead_nurturing',
    industry: 'SaaS',
    estimatedConversionRate: '15-25%',
    estimated_duration_days: 14,
    recommended_for: ['Free trial users', 'Product demo attendees', 'Feature requesters'],
    sequence: [
      {
        name: 'Welcome & Onboarding Call',
        type: 'call',
        delay_hours: 24,
        channel: 'voice',
        message: 'Ensure successful setup and identify use cases',
        order: 1
      },
      {
        name: 'Feature Tutorial Email',
        type: 'email',
        delay_hours: 72,
        channel: 'email',
        message: 'Advanced features guide and best practices',
        order: 2
      },
      {
        name: 'Value Realization Check-in',
        type: 'call',
        delay_hours: 168,
        channel: 'voice',
        message: 'Assess results and discuss expansion',
        order: 3
      },
      {
        name: 'Upgrade Incentive Email',
        type: 'email',
        delay_hours: 264,
        channel: 'email',
        message: 'Special pricing and additional features',
        order: 4
      },
      {
        name: 'Conversion Call',
        type: 'call',
        delay_hours: 312,
        channel: 'voice',
        message: 'Final push to convert before trial expires',
        order: 5
      }
    ]
  },

  {
    id: 'saas_enterprise_outreach',
    name: 'SaaS - Enterprise Outbound',
    description: 'Target enterprise accounts with multi-touch sequence',
    type: 'cold_outreach',
    industry: 'SaaS',
    estimatedConversionRate: '8-12%',
    estimated_duration_days: 21,
    recommended_for: ['Enterprise prospects', 'Fortune 500 companies', 'High-value targets'],
    sequence: [
      {
        name: 'Executive Introduction Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Introduction and value proposition',
        order: 1
      },
      {
        name: 'Industry Insights Email',
        type: 'email',
        delay_hours: 48,
        channel: 'email',
        message: 'Relevant case studies and ROI data',
        order: 2
      },
      {
        name: 'Strategic Follow-up Call',
        type: 'call',
        delay_hours: 168,
        channel: 'voice',
        message: 'Discuss business challenges and solutions',
        order: 3
      },
      {
        name: 'Demo Invitation Email',
        type: 'email',
        delay_hours: 336,
        channel: 'email',
        message: 'Personalized demo invitation',
        order: 4
      },
      {
        name: 'Final Outreach Call',
        type: 'call',
        delay_hours: 504,
        channel: 'voice',
        message: 'Last attempt to secure meeting',
        order: 5
      }
    ]
  },

  // INSURANCE TEMPLATES
  {
    id: 'insurance_life_leads',
    name: 'Insurance - Life Insurance Leads',
    description: 'Convert life insurance inquiries to policy sales',
    type: 'lead_nurturing',
    industry: 'Insurance',
    estimatedConversionRate: '20-30%',
    estimated_duration_days: 10,
    recommended_for: ['Life insurance inquiries', 'Quote requests', 'Family planning prospects'],
    sequence: [
      {
        name: 'Needs Assessment Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Assess coverage needs and family situation',
        order: 1
      },
      {
        name: 'Coverage Options Email',
        type: 'email',
        delay_hours: 4,
        channel: 'email',
        message: 'Personalized coverage recommendations',
        order: 2
      },
      {
        name: 'Quote Discussion Call',
        type: 'call',
        delay_hours: 72,
        channel: 'voice',
        message: 'Review quotes and answer questions',
        order: 3
      },
      {
        name: 'Benefits Reminder SMS',
        type: 'sms',
        delay_hours: 168,
        channel: 'sms',
        message: 'Key benefits and limited-time offer',
        order: 4
      },
      {
        name: 'Policy Application Call',
        type: 'call',
        delay_hours: 240,
        channel: 'voice',
        message: 'Guide through application process',
        order: 5
      }
    ]
  },

  {
    id: 'insurance_auto_renewals',
    name: 'Insurance - Auto Policy Renewals',
    description: 'Retain auto insurance customers at renewal time',
    type: 'winback',
    industry: 'Insurance',
    estimatedConversionRate: '70-85%',
    estimated_duration_days: 14,
    recommended_for: ['Renewal notices', 'Expiring policies', 'Price-sensitive customers'],
    sequence: [
      {
        name: 'Renewal Reminder Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Discuss renewal and any changes needed',
        order: 1
      },
      {
        name: 'Discount Opportunities Email',
        type: 'email',
        delay_hours: 48,
        channel: 'email',
        message: 'Available discounts and savings options',
        order: 2
      },
      {
        name: 'Competitive Analysis Call',
        type: 'call',
        delay_hours: 168,
        channel: 'voice',
        message: 'Compare rates and demonstrate value',
        order: 3
      }
    ]
  },

  // HEALTHCARE TEMPLATES
  {
    id: 'healthcare_appointment_scheduling',
    name: 'Healthcare - Appointment Scheduling',
    description: 'Convert patient inquiries to scheduled appointments',
    type: 'cold_outreach',
    industry: 'Healthcare',
    estimatedConversionRate: '60-75%',
    estimated_duration_days: 3,
    recommended_for: ['Patient inquiries', 'Referrals', 'Follow-up appointments'],
    sequence: [
      {
        name: 'Appointment Availability Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Check availability and schedule appointment',
        order: 1
      },
      {
        name: 'Appointment Confirmation Email',
        type: 'email',
        delay_hours: 2,
        channel: 'email',
        message: 'Appointment details and preparation instructions',
        order: 2
      },
      {
        name: 'Reminder Call',
        type: 'call',
        delay_hours: 48,
        channel: 'voice',
        message: 'Appointment reminder and any questions',
        order: 3
      }
    ]
  },

  {
    id: 'healthcare_wellness_programs',
    name: 'Healthcare - Wellness Program Enrollment',
    description: 'Promote wellness programs to eligible patients',
    type: 'lead_nurturing',
    industry: 'Healthcare',
    estimatedConversionRate: '35-45%',
    estimated_duration_days: 14,
    recommended_for: ['Wellness program prospects', 'Preventive care patients', 'Chronic condition patients'],
    sequence: [
      {
        name: 'Program Introduction Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Introduce wellness program benefits',
        order: 1
      },
      {
        name: 'Program Details Email',
        type: 'email',
        delay_hours: 24,
        channel: 'email',
        message: 'Detailed program information and testimonials',
        order: 2
      },
      {
        name: 'Enrollment Assistance Call',
        type: 'call',
        delay_hours: 168,
        channel: 'voice',
        message: 'Help with enrollment and answer questions',
        order: 3
      },
      {
        name: 'Early Bird Incentive SMS',
        type: 'sms',
        delay_hours: 264,
        channel: 'sms',
        message: 'Limited-time enrollment incentive',
        order: 4
      }
    ]
  },

  // FINANCIAL SERVICES TEMPLATES
  {
    id: 'financial_mortgage_leads',
    name: 'Financial - Mortgage Lead Conversion',
    description: 'Convert mortgage inquiries to pre-approvals',
    type: 'lead_nurturing',
    industry: 'Financial Services',
    estimatedConversionRate: '25-35%',
    estimated_duration_days: 7,
    recommended_for: ['Mortgage inquiries', 'Home buyers', 'Refinance prospects'],
    sequence: [
      {
        name: 'Initial Consultation Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Assess financial situation and needs',
        order: 1
      },
      {
        name: 'Pre-approval Information Email',
        type: 'email',
        delay_hours: 4,
        channel: 'email',
        message: 'Pre-approval process and required documents',
        order: 2
      },
      {
        name: 'Rate Discussion Call',
        type: 'call',
        delay_hours: 72,
        channel: 'voice',
        message: 'Current rates and loan options',
        order: 3
      },
      {
        name: 'Application Assistance Call',
        type: 'call',
        delay_hours: 168,
        channel: 'voice',
        message: 'Guide through application process',
        order: 4
      }
    ]
  },

  // E-COMMERCE TEMPLATES
  {
    id: 'ecommerce_cart_abandonment',
    name: 'E-commerce - Cart Abandonment Recovery',
    description: 'Recover abandoned carts with personalized outreach',
    type: 'winback',
    industry: 'E-commerce',
    estimatedConversionRate: '15-25%',
    estimated_duration_days: 5,
    recommended_for: ['Cart abandoners', 'Browse abandoners', 'Previous customers'],
    sequence: [
      {
        name: 'Cart Recovery Call',
        type: 'call',
        delay_hours: 2,
        channel: 'voice',
        message: 'Ask about cart and offer assistance',
        order: 1
      },
      {
        name: 'Incentive Offer Email',
        type: 'email',
        delay_hours: 24,
        channel: 'email',
        message: 'Special discount to complete purchase',
        order: 2
      },
      {
        name: 'Final Reminder Call',
        type: 'call',
        delay_hours: 96,
        channel: 'voice',
        message: 'Last chance offer and urgency',
        order: 3
      }
    ]
  },

  // EDUCATION TEMPLATES
  {
    id: 'education_course_enrollment',
    name: 'Education - Course Enrollment',
    description: 'Convert course inquiries to paid enrollments',
    type: 'lead_nurturing',
    industry: 'Education',
    estimatedConversionRate: '30-40%',
    estimated_duration_days: 10,
    recommended_for: ['Course inquiries', 'Demo attendees', 'Career changers'],
    sequence: [
      {
        name: 'Career Goals Discussion',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Understand career goals and course fit',
        order: 1
      },
      {
        name: 'Course Curriculum Email',
        type: 'email',
        delay_hours: 24,
        channel: 'email',
        message: 'Detailed curriculum and success stories',
        order: 2
      },
      {
        name: 'Financing Options Call',
        type: 'call',
        delay_hours: 168,
        channel: 'voice',
        message: 'Discuss payment plans and financing',
        order: 3
      },
      {
        name: 'Early Bird Discount Email',
        type: 'email',
        delay_hours: 216,
        channel: 'email',
        message: 'Limited-time enrollment discount',
        order: 4
      }
    ]
  },

  // AUTOMOTIVE TEMPLATES
  {
    id: 'automotive_sales_leads',
    name: 'Automotive - Vehicle Sales Leads',
    description: 'Convert vehicle inquiries to dealership visits',
    type: 'cold_outreach',
    industry: 'Automotive',
    estimatedConversionRate: '20-30%',
    estimated_duration_days: 7,
    recommended_for: ['Vehicle inquiries', 'Test drive requests', 'Trade-in appraisals'],
    sequence: [
      {
        name: 'Vehicle Availability Call',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Confirm vehicle interest and availability',
        order: 1
      },
      {
        name: 'Vehicle Information Email',
        type: 'email',
        delay_hours: 4,
        channel: 'email',
        message: 'Detailed specs, photos, and pricing',
        order: 2
      },
      {
        name: 'Test Drive Scheduling Call',
        type: 'call',
        delay_hours: 72,
        channel: 'voice',
        message: 'Schedule test drive appointment',
        order: 3
      },
      {
        name: 'Incentives Reminder SMS',
        type: 'sms',
        delay_hours: 144,
        channel: 'sms',
        message: 'Current incentives and limited-time offers',
        order: 4
      }
    ]
  },

  // FITNESS/GYM TEMPLATES
  {
    id: 'fitness_membership_sales',
    name: 'Fitness - Membership Sales',
    description: 'Convert gym inquiries to membership sign-ups',
    type: 'cold_outreach',
    industry: 'Fitness',
    estimatedConversionRate: '40-50%',
    estimated_duration_days: 5,
    recommended_for: ['Gym inquiries', 'Trial pass users', 'Fitness goals prospects'],
    sequence: [
      {
        name: 'Fitness Goals Assessment',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Understand fitness goals and preferences',
        order: 1
      },
      {
        name: 'Facility Tour Invitation',
        type: 'email',
        delay_hours: 4,
        channel: 'email',
        message: 'Virtual tour and facility highlights',
        order: 2
      },
      {
        name: 'Personal Training Consultation',
        type: 'call',
        delay_hours: 48,
        channel: 'voice',
        message: 'Offer complimentary training session',
        order: 3
      },
      {
        name: 'Membership Special Offer',
        type: 'sms',
        delay_hours: 96,
        channel: 'sms',
        message: 'Limited-time membership promotion',
        order: 4
      }
    ]
  },

  // CONSULTING TEMPLATES
  {
    id: 'consulting_discovery_calls',
    name: 'Consulting - Discovery Call Booking',
    description: 'Book strategy sessions with potential consulting clients',
    type: 'lead_nurturing',
    industry: 'Consulting',
    estimatedConversionRate: '35-45%',
    estimated_duration_days: 14,
    recommended_for: ['Strategy inquiries', 'Business challenges', 'Growth planning'],
    sequence: [
      {
        name: 'Initial Challenge Discussion',
        type: 'call',
        delay_hours: 0,
        channel: 'voice',
        message: 'Understand business challenges and goals',
        order: 1
      },
      {
        name: 'Case Study Email',
        type: 'email',
        delay_hours: 24,
        channel: 'email',
        message: 'Relevant case studies and success stories',
        order: 2
      },
      {
        name: 'Strategy Session Booking',
        type: 'call',
        delay_hours: 168,
        channel: 'voice',
        message: 'Offer complimentary strategy session',
        order: 3
      },
      {
        name: 'Pre-session Preparation Email',
        type: 'email',
        delay_hours: 240,
        channel: 'email',
        message: 'Session agenda and preparation materials',
        order: 4
      }
    ]
  }
];

// Template categories for easy browsing
export const TEMPLATE_CATEGORIES = [
  {
    id: 'real_estate',
    name: 'Real Estate',
    icon: '🏠',
    description: 'Property sales and rentals',
    templateCount: 2
  },
  {
    id: 'saas',
    name: 'SaaS',
    icon: '💻',
    description: 'Software as a Service',
    templateCount: 2
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    description: 'Life, auto, health insurance',
    templateCount: 2
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical services and wellness',
    templateCount: 2
  },
  {
    id: 'financial',
    name: 'Financial Services',
    icon: '💰',
    description: 'Banking, lending, investments',
    templateCount: 1
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: '🛒',
    description: 'Online retail and sales',
    templateCount: 1
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    description: 'Courses and training programs',
    templateCount: 1
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    description: 'Vehicle sales and services',
    templateCount: 1
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    description: 'Gyms and wellness centers',
    templateCount: 1
  },
  {
    id: 'consulting',
    name: 'Consulting',
    icon: '📊',
    description: 'Business and strategy consulting',
    templateCount: 1
  }
];

// Get templates by category
export function getTemplatesByCategory(categoryId: string): CampaignTemplate[] {
  return CAMPAIGN_TEMPLATES_LIBRARY.filter(template => 
    template.industry?.toLowerCase().replace(/\s+/g, '_') === categoryId ||
    (categoryId === 'financial' && template.industry === 'Financial Services')
  );
}

// Get template by ID
export function getTemplateById(templateId: string): CampaignTemplate | undefined {
  return CAMPAIGN_TEMPLATES_LIBRARY.find(template => template.id === templateId);
}

// Get agent persona template by template ID
export function getAgentPersonaForTemplate(templateId: string) {
  const industryMap: Record<string, keyof typeof AGENT_PERSONA_TEMPLATES> = {
    'real_estate_buyer_leads': 'realEstateAgent',
    'real_estate_seller_leads': 'realEstateAgent',
    'saas_free_trial': 'saasSDR',
    'saas_enterprise_outreach': 'saasSDR',
    'insurance_life_leads': 'insuranceAgent',
    'insurance_auto_renewals': 'insuranceAgent',
    'healthcare_appointment_scheduling': 'healthcareScheduler',
    'healthcare_wellness_programs': 'healthcareScheduler',
  };

  const personaKey = industryMap[templateId];
  return personaKey ? AGENT_PERSONA_TEMPLATES[personaKey] : AGENT_PERSONA_TEMPLATES.saasSDR;
}