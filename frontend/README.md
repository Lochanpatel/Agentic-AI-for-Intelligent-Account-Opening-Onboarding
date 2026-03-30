# 🏦 Frontend - Agentic AI Account Opening

> Modern React frontend for AI-powered account onboarding with real-time agent status tracking and document upload.

## 🚀 Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Zustand** for state management
- **React Query** for server state
- **Framer Motion** for animations
- **Lucide React** for icons

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Agentic AI Onboarding
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page components
│   ├── Landing.tsx     # Landing page
│   ├── Onboarding.tsx  # Main onboarding flow
│   ├── Reviewer.tsx    # Review dashboard
│   └── Admin.tsx       # Admin panel
├── store/              # Zustand stores
│   ├── onboardingStore.ts
│   └── authStore.ts
├── api/                # API client
│   └── client.ts
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

## 🎯 Features

- **Real-time Agent Status**: Live updates from backend agents
- **Document Upload**: Drag-and-drop file upload with preview
- **Progress Tracking**: Visual progress through onboarding steps
- **Responsive Design**: Mobile-first responsive layout
- **Error Handling**: Comprehensive error states and recovery
- **Loading States**: Skeleton loaders and smooth transitions

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
npm run build
# Output in dist/ folder
```

## 🔧 Configuration

The app communicates with the backend API through the configured `VITE_API_URL`. Make sure this points to your backend instance in production.

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check
```

---

*Built with React · TypeScript · Vite · TailwindCSS*
