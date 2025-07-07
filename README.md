# Norivane AI Strategy Questionnaire

A sophisticated questionnaire application for VC/PE leaders to assess AI readiness and generate qualified leads for Norivane.com.

## Features

- **Strategic Questionnaire**: 6 carefully crafted questions targeting VC/PE decision makers
- **Email Capture**: Compelling benchmarking incentive to capture contact information
- **Personalized Feedback**: AI readiness scoring with peer comparisons
- **Benchmark Data**: Comparison with 500+ VC/PE leaders
- **Lead Generation**: Integrated Calendly CTA for Matthew Broadbent consultations

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Custom CSS with Montserrat typography
- **Animations**: Framer Motion
- **Database**: Supabase
- **Routing**: React Router DOM
- **Deployment**: Vercel

## Brand Guidelines

- **Colors**: Deep Blue (#0A2342), Sharp Teal (#00B2A9)
- **Typography**: Montserrat font family
- **Logo**: Norivane wordmark with italic teal "i"

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application uses a Supabase table `ceo_ai_responses` with the following structure:

- `id`: UUID primary key
- `timestamp`: Timestamptz
- `ai_importance_rating`: Integer (1-5)
- `ai_current_approach`: Text array
- `initial_ai_focus`: Text array
- `initial_ai_focus_other`: Text (optional)
- `has_ai_strategy`: Text ('Yes', 'No', 'Partially')
- `strategy_prioritisation`: Text array (optional)
- `strategy_prioritisation_other`: Text (optional)
- `hypothetical_impact`: Text
- `future_strategy_confidence`: Integer (1-5)
- `ip_address`: Text (optional)
- `email`: Text (optional)
- `first_name`: Text (optional)

## Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Lead Generation Flow

1. **Landing Page**: Value proposition and CTA
2. **Questionnaire**: 6 strategic questions with progress tracking
3. **Email Capture**: Benchmarking incentive with validation
4. **Feedback Page**: Personalized results with Calendly CTA

## Target Audience

- VC/PE CEOs and Managing Partners
- Investment committee members
- Portfolio management leaders
- Strategic planning executives

## Value Proposition

- 50% reduction in deal sourcing costs
- 25%+ acceleration in deal flow
- Increased ROI across portfolio companies
- Strategic AI implementation guidance

## Contact

For technical support or business inquiries, contact Matthew Broadbent via the integrated Calendly system.
