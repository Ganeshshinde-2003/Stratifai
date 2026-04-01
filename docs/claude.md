# System Design & Architecture

## Overview

This document explains the technical architecture, design decisions, and implementation details of the AI Marketing Intelligence Engine.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐        │
│  │ InputForm   │  │   Loading   │  │   Results    │        │
│  └─────────────┘  └─────────────┘  └──────────────┘        │
│         │                  │                 │              │
│         └──────────────────┴─────────────────┘              │
│                          │                                  │
│                     API Service                             │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    HTTP/REST API
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                  Backend (FastAPI)                           │
│                          │                                  │
│              ┌───────────┴───────────┐                      │
│              │   Routes/Endpoints    │                      │
│              └───────────┬───────────┘                      │
│                          │                                  │
│      ┌──────────────────┼──────────────────┐               │
│      │                  │                  │               │
│  ┌───▼───┐      ┌──────▼──────┐    ┌─────▼─────┐          │
│  │Scraper│      │LLM Pipeline │    │PDF Gen    │          │
│  └───┬───┘      └──────┬──────┘    └─────┬─────┘          │
│      │                 │                  │               │
└──────┼─────────────────┼──────────────────┼───────────────┘
       │                 │                  │
   ┌───▼───┐       ┌─────▼──────┐    ┌─────▼─────┐
   │Website│       │Vertex AI   │    │PDF File   │
   └───────┘       └────────────┘    └───────────┘
```

## Component Breakdown

### Frontend Layer

#### 1. InputForm Component
**Purpose**: Accept and validate user input

**Key Features**:
- Toggle between URL and text input
- Client-side validation
- Error handling
- Loading state management

**Design Decisions**:
- CSS Modules for scoped styling (prevents conflicts)
- Controlled components for form inputs (React best practice)
- Immediate validation feedback (better UX)

#### 2. Loading Component
**Purpose**: Provide engaging feedback during AI processing

**Key Features**:
- Animated spinner
- 3-step visualization
- Clear time expectations

**Design Decisions**:
- CSS animations (no external libraries = smaller bundle)
- Shows process steps to build trust
- Sets expectations with "30-60 seconds" message

#### 3. Results Component
**Purpose**: Display marketing strategy in structured, readable format

**Key Features**:
- Sectioned layout
- PDF download
- Reset functionality
- Clean, professional design

**Design Decisions**:
- Responsive grid layout (works on all devices)
- Progressive disclosure (one section at a time)
- Visual hierarchy with colors and spacing

#### 4. API Service
**Purpose**: Centralized API communication

**Key Features**:
- Typed interfaces (TypeScript)
- Error handling
- Timeout management (2 minutes for LLM processing)
- PDF blob handling

**Design Decisions**:
- Axios over fetch (better error handling, timeout support)
- Centralized error messages (consistent UX)
- TypeScript interfaces (type safety)

### Backend Layer

#### 1. FastAPI Main Application
**Purpose**: HTTP server and request routing

**Key Features**:
- CORS configuration (allows frontend to communicate)
- API documentation (auto-generated at /api/docs)
- Health check endpoint
- Structured routing

**Design Decisions**:
- FastAPI over Flask (better async support, auto-docs, type validation)
- Separate routers for modularity
- CORS restricted to localhost (security)

#### 2. Web Scraper Service
**Purpose**: Extract content from product URLs

**Key Features**:
- URL validation
- HTML parsing (BeautifulSoup4)
- Content cleaning and structuring
- Chunking for LLM limits

**Implementation Details**:
```python
class WebScraper:
    - validate_url(): Ensures proper URL format
    - scrape_url(): Fetches and parses content
    - _extract_content(): Structures data (title, headings, paragraphs)
    - _clean_text(): Removes noise, normalizes whitespace
    - chunk_content(): Limits content to 4000 chars for LLM
```

**Design Decisions**:
- Remove nav, footer, scripts (focus on product content)
- Take first 10 headings, 20 paragraphs (balance quality vs. quantity)
- User-agent header (avoid being blocked by websites)
- Timeout after 10 seconds (don't hang on slow sites)

#### 3. LLM Pipeline Service
**Purpose**: Multi-step AI strategy generation

This is the CORE of the product. Critical design decision: **3 separate prompts, not 1**.

**Why 3 Steps?**
1. **Specialization**: Each step has a focused task with appropriate temperature
2. **Quality**: Step-by-step reasoning produces better results
3. **Control**: We can validate and retry each step independently
4. **Consistency**: Structured outputs feed into next step

**Step 1: Product Understanding**
```python
Temperature: 0.2 (low = factual, precise)
Input: Raw product content
Output: Structured JSON with product_summary, target_audience, features, etc.
Goal: Extract facts, minimize hallucination
```

**Step 2: Marketing Strategy**
```python
Temperature: 0.5 (medium = balanced creativity)
Input: Step 1 JSON output
Output: ICP, positioning, marketing pain points, messaging angles
Goal: Strategic thinking based on facts
```

**Step 3: Content Generation**
```python
Temperature: 0.8 (high = creative, varied)
Input: Step 1 + Step 2 JSON outputs
Output: Ad copy, emails, landing page
Goal: Creative, engaging marketing content
```

**JSON Validation & Retry Logic**:
```python
for attempt in range(max_retries):
    try:
        response = gemini_api.generate(prompt)
        # Clean markdown code blocks if present
        # Parse JSON
        # Validate with Pydantic
        return parsed_json
    except JSONDecodeError:
        if attempt < max_retries - 1:
            prompt += "\n\nReturn ONLY valid JSON."
        else:
            raise
```

**Design Decisions**:
- Google Vertex AI (enterprise-grade, fast, high quality with Gemini models)
- Pydantic validation (ensures output structure matches schema)
- Retry logic with stricter prompts (handles occasional formatting issues)
- Separate model calls (not streaming = simpler, more reliable)

#### 4. PDF Generator Service
**Purpose**: Convert strategy to shareable PDF

**Key Features**:
- Professional formatting
- Custom styles
- Structured sections
- Automatic filename generation

**Implementation Details**:
```python
class PDFGenerator:
    - _setup_custom_styles(): Creates typography styles
    - generate_pdf(): Builds PDF from data dict
    - Returns BytesIO buffer (in-memory, no disk writes)
```

**Design Decisions**:
- ReportLab (Python standard for PDF generation)
- BytesIO buffer (faster than disk I/O)
- Custom styles (branded, professional look)
- Structured sections (mirrors web display)

#### 5. Data Models (Pydantic)
**Purpose**: Type safety, validation, documentation

**Models**:
- `InputRequest`: Validates user input
- `ProductUnderstanding`: Step 1 output
- `MarketingStrategy`: Step 2 output
- `ContentGeneration`: Step 3 output
- `FinalOutput`: Merged result

**Design Decisions**:
- Pydantic validators (validate input_type, non-empty strings)
- Strict typing (catches errors early)
- Auto-generated API docs (FastAPI uses these schemas)

## Data Flow

### Happy Path
```
1. User enters URL in frontend
2. Frontend validates format
3. POST to /api/generate
4. Backend validates request (Pydantic)
5. Scraper fetches URL, extracts content
6. Content chunked to 4000 chars
7. LLM Pipeline Step 1: Product Understanding
   - Call Vertex AI with temperature=0.2
   - Validate JSON response
   - Parse into ProductUnderstanding model
8. LLM Pipeline Step 2: Marketing Strategy
   - Call Vertex AI with Step 1 output, temperature=0.5
   - Validate JSON response
   - Parse into MarketingStrategy model
9. LLM Pipeline Step 3: Content Generation
   - Call Vertex AI with Step 1+2 output, temperature=0.8
   - Validate JSON response
   - Parse into ContentGeneration model
10. Merge into FinalOutput model
11. Return JSON to frontend
12. Frontend displays in Results component
13. User clicks "Download PDF"
14. POST to /api/generate/pdf with strategy data
15. PDF generated in-memory
16. Streamed to browser as download
```

### Error Handling

**Frontend**:
- Invalid URL format → Client-side error message
- Empty input → Client-side error message
- Network error → "Backend not running" message
- API error → Display error.detail from backend

**Backend**:
- Invalid URL (scraper) → 400 Bad Request
- Scraping failed → 400 with detail message
- Empty content → 400 "Content too short"
- Vertex AI error → 500 with detail
- JSON validation failed (3 retries) → 500 with detail

## Performance Considerations

### Frontend
- CSS Modules (scoped, no global pollution)
- No heavy libraries (keeps bundle small)
- Lazy loading (Next.js automatic code splitting)
- Responsive design (one codebase for all devices)

### Backend
- Async FastAPI (handles concurrent requests)
- Connection pooling (requests library default)
- No database (stateless = horizontally scalable)
- Timeout limits (prevents hanging on slow APIs)

### LLM Pipeline
- Sequential steps (required for quality)
- Chunking content (stays within token limits)
- Retry logic (handles transient failures)
- Temperature tuning (optimizes each step)

## Security Considerations

1. **CORS**: Restricted to localhost (frontend origin)
2. **Input Validation**: Pydantic validators on all inputs
3. **URL Validation**: Regex check before scraping
4. **Timeout Limits**: Prevents DOS via slow requests
5. **No Data Storage**: No PII, no database (privacy by design)
6. **API Key**: Environment variable, never committed

## Scalability

**Current (MVP)**:
- Single-server deployment
- Stateless design (easy to scale horizontally)
- No database (no bottleneck)

**Future Optimizations**:
- Add Redis caching (for repeated URLs)
- Queue system for LLM calls (handle spikes)
- Rate limiting (prevent abuse)
- CDN for frontend (faster global delivery)

## Testing Strategy (Future)

**Unit Tests**:
- Scraper: Mock HTTP responses, test extraction
- LLM Pipeline: Mock Vertex AI, test JSON parsing
- PDF Generator: Test output structure
- Models: Test validators

**Integration Tests**:
- End-to-end API calls
- Frontend component rendering
- Error handling flows

**Manual QA**:
- Real product URLs
- Edge cases (empty content, malformed HTML)
- UI/UX validation

## Deployment Architecture (Future)

```
Frontend: Vercel (or Netlify)
- Automatic HTTPS
- CDN
- Edge functions

Backend: Railway (or Fly.io, Render)
- Auto-scaling
- Health checks
- Environment secrets

Monitoring:
- Sentry (error tracking)
- PostHog (analytics)
- Uptime monitoring
```

## Key Takeaways

1. **3-Step Pipeline**: The core innovation - better quality than single-prompt approaches
2. **Type Safety**: Pydantic + TypeScript catch errors early
3. **Modular Design**: Each service has one responsibility
4. **Production-Ready**: Error handling, validation, timeouts, CORS
5. **Scalable**: Stateless design allows horizontal scaling
6. **User-Focused**: Fast, clean, professional UX

## Lessons Learned

1. **Temperature Matters**: Different temps for different steps dramatically improves output
2. **JSON Retry Logic**: LLMs occasionally return malformed JSON - retry with stricter prompt works
3. **Chunking is Critical**: LLMs have token limits - must chunk large content
4. **Validation Everywhere**: Pydantic catches bad data before it causes issues
5. **Clean UI Matters**: Raw AI output looks amateur - structure and design make it feel professional
