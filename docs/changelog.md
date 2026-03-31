# Changelog

All notable changes to Stratifai will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0] - 2024-03-31

### Added - UI Redesign & Landing Page

#### Branding
- **Product Rebranding to "Stratifai"**
  - New name combining "Stratify" + "AI"
  - Professional logo with layered triangle design
  - Separate SVG logos for light and dark themes
  - Logo automatically switches based on theme
  - Files: `frontend/public/logo-light.svg`, `frontend/public/logo-dark.svg`

#### Landing Page
- **Professional Marketing Landing Page** (`components/LandingPage.tsx`)
  - Sticky navigation with backdrop blur effect
  - Hero section with clear value proposition
  - Problem section highlighting 3 marketing challenges
  - Solution section with 6 features and growth impact metrics
  - Stats section (60s generation, 15+ assets, 3x conversion, $10k saved)
  - "How It Works" 4-step process visualization
  - Final CTA section
  - Professional footer with brand info and navigation links
  - Full responsive design for mobile, tablet, desktop
  - Theme toggle integration
  - Files: `components/LandingPage.tsx`, `styles/LandingPage.module.css`

- **Landing Page Routing**
  - Landing page displays at "/" route
  - "Get Started" button transitions to main app
  - Conditional rendering based on user interaction
  - Updated page titles and meta descriptions
  - Files: `pages/index.tsx` (UPDATED)

#### Complete UI Redesign
- **Soft Neutral Color Palette** (globals.css)
  - Light mode: Off-white (#FAFAFA) with charcoal (#2C2C2C)
  - Dark mode: Charcoal (#2C2C2C) with off-white (#FAFAFA)
  - Neutral grays for backgrounds (#F5F5F5, #EEEEEE)
  - Consistent border colors (#DDDDDD, #CCCCCC, #BBBBBB)
  - Removed all vibrant purple/pink gradients

- **Gradient Removal** (All Component CSS)
  - Removed all gradient backgrounds from navigation
  - Removed gradient text effects from titles
  - Removed gradient buttons throughout app
  - Removed gradient badges and tags
  - Removed gradient spinners and progress bars
  - Removed gradient from analytics stat cards
  - Removed gradient from feature numbers
  - Removed gradient from email headers
  - Replaced with solid colors using CSS variables

- **Icon Removal for Minimalism**
  - Removed all emoji icons from UI
  - Navigation buttons: "New Strategy", "History", "Analytics" (no icons)
  - Theme toggle: "Dark" / "Light" text instead of emoji
  - Loading states: No emoji icons
  - Input form: No feature emoji icons
  - History dashboard: "URL" / "Text" text badges instead of emojis
  - Delete buttons: × symbol instead of emoji
  - Results tabs: No tab icons
  - All copy buttons: "Copy" text instead of emoji
  - Files: All component files updated

- **Animation Simplification**
  - Removed complex scale animations
  - Simplified tooltip to opacity-only fade
  - Removed shimmer and pulse effects
  - Kept smooth transitions for professional feel
  - Files: `components/Tooltip.tsx`, all CSS modules

#### Files Modified
- Updated all CSS module files (12+ files)
- Updated all React components for minimal design
- Updated navigation branding
- Updated page titles to "Stratifai"

### Changed
- Product name from "AI Marketing Intelligence Engine" to "Stratifai"
- Complete visual redesign to minimal aesthetic
- All purple/pink gradients replaced with neutral colors
- All emoji icons replaced with text or removed
- Border radius reduced from 16px to 8px for sharper look
- Shadow effects minimized for cleaner appearance

### Removed
- All gradient CSS (background, text, borders)
- All emoji icons throughout the application
- Complex animations and effects
- Colorful accent colors in favor of neutral palette

## [1.0.0] - 2024-03-28

### Added - Initial MVP Release

#### Backend
- **FastAPI Application**
  - Main application server with CORS configuration
  - Health check endpoint at `/health`
  - Auto-generated API documentation at `/api/docs`
  - Structured routing with separate router modules

- **Web Scraper Service** (`services/scraper.py`)
  - URL validation using urlparse
  - BeautifulSoup4-based HTML parsing
  - Extraction of title, meta description, headings, and paragraphs
  - Content cleaning (removes scripts, styles, navigation elements)
  - Text normalization and whitespace cleanup
  - Content chunking (max 4000 characters for LLM processing)
  - Configurable timeout (10 seconds default)

- **LLM Pipeline Service** (`services/llm_pipeline.py`)
  - **3-Step Multi-Prompt Architecture**:
    - Step 1: Product Understanding (temperature 0.2) - Factual analysis
    - Step 2: Marketing Strategy (temperature 0.5) - Strategic planning
    - Step 3: Content Generation (temperature 0.8) - Creative copywriting
  - Google Gemini API integration (gemini-1.5-flash model)
  - JSON validation with automatic retry logic (max 3 attempts)
  - Markdown code block detection and extraction
  - Pydantic model validation for all outputs
  - Error handling for API failures and JSON parsing issues

- **PDF Generator Service** (`services/pdf_generator.py`)
  - ReportLab-based PDF generation
  - Custom typography styles (title, section, subsection, body)
  - Professional formatting with gradients and spacing
  - In-memory PDF generation (BytesIO buffer)
  - Structured sections mirroring web display
  - Automatic date stamping

- **Data Models** (`models/schemas.py`)
  - `InputRequest` - Input validation with type checking
  - `ProductUnderstanding` - Step 1 output schema
  - `MarketingStrategy` - Step 2 output schema
  - `ContentGeneration` - Step 3 output schema
  - `FinalOutput` - Merged final result
  - `ErrorResponse` - Standardized error format
  - Custom Pydantic validators for input validation

- **API Endpoints** (`routes/generate.py`)
  - `POST /api/generate` - Generate marketing strategy from URL or text
  - `POST /api/generate/pdf` - Generate PDF from strategy data
  - `GET /api/health` - Health check endpoint

- **Configuration**
  - Environment variable support via python-dotenv
  - `requirements.txt` with pinned versions
  - Configurable port (default 8000)

#### Frontend
- **Next.js 14 Application**
  - TypeScript configuration
  - CSS Modules for scoped styling
  - Responsive design (mobile, tablet, desktop)

- **InputForm Component** (`components/InputForm.tsx`)
  - Toggle between URL and text input
  - Client-side validation
  - URL format validation (regex)
  - Minimum character requirement for text (50 chars)
  - Loading state handling
  - Feature badges display
  - Error message display

- **Loading Component** (`components/Loading.tsx`)
  - Animated CSS spinner
  - 3-step process visualization
  - Time expectation messaging
  - Clean, professional design

- **Results Component** (`components/Results.tsx`)
  - Structured section display:
    - Product Summary
    - Target Audience
    - Market Positioning
    - Ad Copy Variations (grid layout)
    - Email Sequence (3 emails with subject/body)
    - Landing Page Structure (headline, subheadline, sections, CTA)
  - PDF download button
  - Reset/New Strategy button
  - Responsive grid layouts
  - Badge system for variations
  - Email preview cards with headers

- **API Service** (`services/api.ts`)
  - TypeScript interfaces for type safety
  - Axios-based HTTP client
  - 2-minute timeout for LLM processing
  - Comprehensive error handling
  - PDF download with blob handling
  - Automatic file download trigger

- **Styling** (`styles/`)
  - Global styles with gradient background
  - Component-specific CSS Modules
  - Professional color scheme (purple gradient theme)
  - Hover effects and transitions
  - Responsive breakpoints
  - Clean typography hierarchy

#### Infrastructure
- **Environment Configuration**
  - `.env.example` file with required variables
  - `.gitignore` for Python and Node.js

#### Documentation
- **Product Documentation** (`docs/product.md`)
  - Product overview and features
  - Use cases and target market
  - Technical stack details
  - Competitive advantages
  - Future roadmap
  - Pricing strategy

- **Technical Documentation** (`docs/claude.md`)
  - System architecture diagram
  - Component breakdown
  - Design decisions and rationale
  - Data flow documentation
  - Error handling strategy
  - Performance considerations
  - Security considerations
  - Scalability notes
  - Testing strategy
  - Deployment architecture
  - Key lessons learned

- **Changelog** (`docs/changelog.md`)
  - Version history tracking
  - Change categorization

### Design Decisions

#### Why 3-Step Pipeline?
- **Separation of Concerns**: Each step has a focused task
- **Quality Control**: Validate outputs at each stage
- **Temperature Tuning**: Different creativity levels per step
- **Retry Logic**: Can retry individual steps without redoing everything

#### Why These Temperatures?
- **0.2 for Product Analysis**: Factual, precise, minimal hallucination
- **0.5 for Strategy**: Balanced between facts and creativity
- **0.8 for Content**: Maximum creativity for engaging copy

#### Why FastAPI?
- Auto-generated API documentation
- Pydantic integration for validation
- Async support for scalability
- Modern Python 3.10+ features
- Great developer experience

#### Why Next.js?
- Best-in-class React framework
- Automatic code splitting
- Built-in TypeScript support
- Easy deployment (Vercel)
- Great developer experience

#### Why Google Gemini?
- Cost-effective ($0.00025/1K tokens vs. GPT-4 $0.03/1K)
- Fast response times
- Good quality outputs
- Simple API
- Generous rate limits

### Known Limitations

#### MVP Constraints
- No user authentication
- No data persistence (strategies not saved)
- No usage analytics
- Single language (English only)
- No custom prompt templates
- Limited to 4000 characters of content per generation

#### Browser Compatibility
- Requires modern browsers (ES6+ support)
- Tested on Chrome, Firefox, Safari (latest versions)

#### Scraping Limitations
- May fail on JavaScript-heavy sites
- Blocked by some bot protection services
- Limited to publicly accessible content
- 10-second timeout may be too short for slow sites

#### LLM Limitations
- Occasional JSON formatting errors (handled by retry logic)
- Quality depends on input quality
- English-only outputs
- No fine-tuning for specific industries

### Security Notes
- API keys stored in environment variables only
- CORS restricted to localhost
- No SQL injection risk (no database)
- Input validation on all endpoints
- No file uploads (no file-based attacks)

### Performance Metrics
- Average generation time: 30-60 seconds
- Frontend bundle size: ~200KB (gzipped)
- Backend memory usage: ~100MB base
- API response time (excluding LLM): < 100ms

## [Unreleased] - Future Features

### Planned
- User authentication and accounts
- Save and manage multiple strategies
- Strategy history and versioning
- Custom prompt templates
- Brand voice customization
- Multi-language support
- Competitive analysis integration
- Team collaboration features
- Usage analytics dashboard
- API rate limiting
- Redis caching layer
- Queue system for LLM calls

### Under Consideration
- Custom LLM fine-tuning
- Integration with marketing tools (Mailchimp, HubSpot)
- Social media content generation
- SEO keyword analysis
- Competitor comparison mode
- A/B testing recommendations
- White-label version for agencies

---

## Version History

- **1.1.0** (2024-03-31) - UI Redesign & Landing Page
- **1.0.0** (2024-03-28) - Initial MVP Release
