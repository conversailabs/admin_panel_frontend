# Voice AI Sales Agent Admin Frontend

A comprehensive admin dashboard for managing AI sales agents, campaigns, and leads built with Next.js 14 and minimal dependencies.

## 🚀 Features

### ✅ Completed Features

#### Authentication System
- User registration and login
- JWT token management
- Organization creation and management
- Protected routes and role-based access

#### Agent Management
- Multi-step agent creation wizard
- Voice selection (English US/UK, Hinglish Male/Female)
- YAML script builder with templates
- Call flow and outcome management
- Agent dashboard with search and filtering

#### Campaign Management
- Campaign creation wizard with templates
- Visual sequence builder
- Lead selection and assignment
- Real-time progress tracking
- Campaign analytics dashboard

#### Core Infrastructure
- Minimal dependencies (Next.js, React, TypeScript, Tailwind CSS)
- Custom UI components built from scratch
- Type-safe API integration
- Form handling with native HTML5 validation
- Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **Form Handling**: Custom hooks with HTML5 validation
- **API Client**: Native fetch with custom wrapper
- **Deployment**: Vercel-ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/conversailabs/admin_panel_frontend.git
cd admin_panel_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Environment Configuration

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production, replace with your Google Cloud backend URL:
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   │   ├── agents/        # Agent management
│   │   ├── campaigns/     # Campaign management
│   │   └── leads/         # Lead management
│   └── organization/      # Organization setup
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── campaign/         # Campaign-specific components
├── hooks/                # Custom React hooks
├── lib/                  # API client and utilities
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🎯 Key Components

### Agent Creation Wizard
- **Step 1**: Agent Information (name)
- **Step 2**: Voice & Channels (6 voice options, channel selection)
- **Step 3**: YAML Script Builder (templates, greeting message, prompt config)
- **Step 4**: Call Flow Management (outcome rules, retry logic)

### Campaign Management
- **Campaign Templates**: Cold Outreach, Lead Nurturing, Event Follow-up
- **Sequence Builder**: Visual flow designer with drag-and-drop
- **Lead Selection**: Manual selection, filtering, CSV import
- **Analytics**: Real-time progress tracking and conversion metrics

### YAML Templates
Pre-built templates for common use cases:
- Lead Qualification Agent
- Appointment Setting Agent
- Follow-up Agent

## 🔗 API Integration

The frontend integrates with a Google Cloud-hosted backend. API endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/signup`
- **Agents**: `/api/agents/`, `/api/agents/{id}`
- **Campaigns**: `/api/campaigns/`, `/api/campaigns/{id}`
- **Leads**: `/api/leads/`, `/api/leads/{id}`

## 🚀 Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 🎨 Design System

### Custom UI Components
- Button, Input, Select, Textarea
- Card, Table, Badge, Tabs
- Form validation and error handling
- Loading states and animations

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Dark/light mode ready
- Accessible components

## 📈 Performance

- **Minimal Bundle Size**: Only essential dependencies
- **Type Safety**: Full TypeScript coverage
- **Optimized Build**: Next.js optimization
- **Fast Navigation**: App Router with streaming

## 🔒 Security

- JWT token management
- Protected routes
- Input validation
- XSS protection
- Environment variable security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is proprietary to Conversa Labs.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

Built with ❤️ by the Conversa Labs team
