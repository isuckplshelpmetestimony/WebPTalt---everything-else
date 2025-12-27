# PT Software

A modern Physical Therapy software system built with Next.js 14, TypeScript, and Tailwind CSS. This application replaces outdated WebPT interfaces with a clean, professional design using the Cairos design system.

## Features

### Core Screens

1. **Document Creation** (`/documents/new`)
   - Case selection with authorization status
   - Document type selection (PT Daily Note, Initial Evaluation, etc.)
   - Entry date options (Today, Yesterday, Custom)
   - Time tracking with increment buttons
   - Provider assignment (Rendering + Co-signing)
   - Copy from locked document option

2. **Patient Chart** (`/patients/[id]`)
   - Authorization warnings (expiring/expired)
   - Incomplete notes warnings
   - Case and insurance information
   - Document organization by date
   - Document locking system
   - Document tabs (All, Organizers, Full Chart, Locked)

3. **Scheduling** (`/schedule`)
   - Multi-provider view with tabs
   - Resource/Provider selection
   - Configurable time slot granularity (5, 10, 15, 20, 30, 60 minutes)
   - Appointment status indicators
   - Wait list functionality
   - Context menu actions (Check In, No Show, Cancel, etc.)
   - Current time indicator

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (extending Cairos design system)
- **State Management**: React Context + useState/useReducer
- **Date/Time**: date-fns
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pt-software/
├── app/                    # Next.js app router pages
│   ├── documents/          # Document creation and management
│   ├── patients/           # Patient chart views
│   └── schedule/           # Scheduling interface
├── components/
│   ├── ui/                 # Base UI components
│   ├── documents/          # Document-specific components
│   ├── patients/           # Patient chart components
│   ├── schedule/           # Scheduling components
│   └── shared/             # Shared components
├── docs/                   # Project documentation
│   ├── meeting-transcript-december-22.md  # Full meeting transcript
│   └── requirements-summary.md           # Key requirements summary
├── lib/
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # Application constants
│   └── utils/              # Utility functions
└── styles/                 # Global styles
```

## Documentation

- **Requirements Summary**: See `docs/requirements-summary.md` for key requirements and insights from stakeholder meetings
- **Meeting Transcript**: Full transcript from December 22 meeting with PTs Liza and Susan in `docs/meeting-transcript-december-22.md`

## Design System

The application uses the Cairos design system with the following key tokens:

### Colors
- Primary: `#333f91` (Cairos Primary)
- Success: `#62bd2d`
- Warning: `#ff9e0b`
- Alert: `#e1516c`
- Background: `#FFFFFC`
- Border: `#EAE5E3`

### Typography
- H1: 48px Bold Avenir
- H2: 36px Bold Avenir
- H3: 30px Semibold Avenir
- Body: 16px Regular
- Body Small: 14px Regular

### Spacing
- Base unit: 8px
- Card padding: 32px
- Section spacing: 24px
- Border radius: 24px

## Development

### Adding New Components

1. Create component file in appropriate directory under `components/`
2. Use TypeScript interfaces for props
3. Follow existing component patterns
4. Use Tailwind utility classes for styling
5. Extend design system tokens when needed

### Data Models

All data models are defined in `lib/types/`:
- `patient.ts` - Patient, Case, Insurance types
- `document.ts` - Document and DocumentType types
- `schedule.ts` - Appointment, Provider, Resource types
- `clinical.ts` - Vitals, Assessment types

## Future Enhancements

- Backend API integration
- Real-time updates
- Advanced filtering and search
- Customizable views
- Reporting and analytics
- Mobile app version

## License

Private - Internal Use Only

