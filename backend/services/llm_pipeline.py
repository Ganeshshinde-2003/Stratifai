import vertexai
from vertexai.preview.generative_models import GenerativeModel, GenerationConfig
import json
import os
from typing import Dict, Any
from google.oauth2 import service_account
from models.schemas import (
    ProductUnderstanding,
    MarketingStrategy,
    ContentGeneration,
    SocialMediaPosts,
    SEOData,
    CompetitorAnalysis,
    FinalOutput
)
from services.scraper import WebScraper


class LLMPipeline:
    """
    Multi-step LLM pipeline for marketing strategy generation
    Uses Google Vertex AI with Gemini models
    """

    def __init__(self):
        """Initialize the LLM pipeline with Vertex AI credentials"""
        # Get configuration from environment
        project_id = os.getenv('PROJECT_ID')
        location = os.getenv('LOCATION', 'us-central1')
        google_credentials_json = os.getenv('google_credentials')

        if not project_id:
            raise ValueError("PROJECT_ID is required")
        if not google_credentials_json:
            raise ValueError("google_credentials is required")

        # Parse credentials JSON
        try:
            credentials_info = json.loads(google_credentials_json)
            credentials = service_account.Credentials.from_service_account_info(credentials_info)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid google_credentials JSON: {str(e)}")

        # Initialize Vertex AI
        vertexai.init(
            project=project_id,
            location=location,
            credentials=credentials
        )

        print(f"Vertex AI initialized: Project={project_id}, Location={location}")

    def _call_gemini(self, prompt: str, temperature: float = 0.5, max_retries: int = 3) -> Dict[str, Any]:
        """
        Call Vertex AI Gemini with JSON validation and retry logic

        Args:
            prompt: The prompt to send
            temperature: Temperature for generation
            max_retries: Maximum number of retries for invalid JSON

        Returns:
            Parsed JSON response
        """
        # Use Gemini 2.5 Flash Lite via Vertex AI
        model = GenerativeModel('gemini-2.5-flash-lite')

        for attempt in range(max_retries):
            try:
                generation_config = GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=8192,
                )

                response = model.generate_content(
                    prompt,
                    generation_config=generation_config
                )

                # Extract text from response
                response_text = response.text.strip()

                # Try to extract JSON from markdown code blocks if present
                if '```json' in response_text:
                    response_text = response_text.split('```json')[1].split('```')[0].strip()
                elif '```' in response_text:
                    response_text = response_text.split('```')[1].split('```')[0].strip()

                # Parse JSON
                parsed_json = json.loads(response_text)
                return parsed_json

            except json.JSONDecodeError as e:
                if attempt < max_retries - 1:
                    # Retry with stricter prompt
                    prompt = f"{prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanations, just JSON."
                else:
                    raise Exception(f"Failed to get valid JSON after {max_retries} attempts: {str(e)}")

            except Exception as e:
                raise Exception(f"Vertex AI Gemini error: {str(e)}")

        raise Exception("Failed to get valid response from Vertex AI Gemini")

    def step1_product_understanding(self, content: str) -> ProductUnderstanding:
        """
        Step 1: Extract product understanding

        Args:
            content: Cleaned product content

        Returns:
            ProductUnderstanding object
        """
        prompt = f"""You are an expert product analyst and startup strategist.

INPUT:
{content}

TASK:
Extract the following information from the product content:
- Product summary (2-3 sentences describing what the product does)
- Target audience (who is this product for)
- Key features (list of 3-5 main features)
- Value proposition (unique selling point)
- Pain points (problems this product solves)

RULES:
- Base your analysis ONLY on the provided content
- Do not hallucinate or add information not present in the content
- Be precise and concise
- If information is not available, use general inference based on the product type

OUTPUT FORMAT (STRICT JSON):
{{
  "product_summary": "Brief product description",
  "target_audience": "Target user segment",
  "key_features": ["Feature 1", "Feature 2", "Feature 3"],
  "value_proposition": "Unique value proposition",
  "pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"]
}}

Return ONLY the JSON object, no additional text."""

        result = self._call_gemini(prompt, temperature=0.2)
        return ProductUnderstanding(**result)

    def step2_marketing_strategy(self, product_understanding: ProductUnderstanding) -> MarketingStrategy:
        """
        Step 2: Generate marketing strategy

        Args:
            product_understanding: Output from step 1

        Returns:
            MarketingStrategy object
        """
        prompt = f"""You are a senior growth marketer with expertise in B2B and B2C marketing.

INPUT (Product Analysis):
{product_understanding.model_dump_json(indent=2)}

TASK:
Based on the product analysis, generate:
- ICP (Ideal Customer Profile): Detailed description of the perfect customer
- Positioning: How to position this product in the market
- Marketing pain points: Specific pain points to emphasize in marketing
- Messaging angles: 3-4 different messaging angles to test

RULES:
- Think like a growth marketer
- Focus on actionable insights
- Consider competitive positioning
- Be specific and practical

OUTPUT FORMAT (STRICT JSON):
{{
  "icp": "Detailed ideal customer profile as a SINGLE STRING (e.g., 'B2B SaaS companies with 10-100 employees in tech industry, using modern development tools, facing scaling challenges')",
  "positioning": "Market positioning statement",
  "marketing_pain_points": ["Marketing pain point 1", "Marketing pain point 2", "Marketing pain point 3"],
  "messaging_angles": ["Angle 1", "Angle 2", "Angle 3", "Angle 4"]
}}

Return ONLY the JSON object, no additional text."""

        result = self._call_gemini(prompt, temperature=0.5)
        return MarketingStrategy(**result)

    def step3_content_generation(
        self,
        product_understanding: ProductUnderstanding,
        marketing_strategy: MarketingStrategy,
        brand_voice: str = 'professional'
    ) -> ContentGeneration:
        """
        Step 3: Generate marketing content

        Args:
            product_understanding: Output from step 1
            marketing_strategy: Output from step 2
            brand_voice: Tone of voice (professional, casual, playful, technical)

        Returns:
            ContentGeneration object
        """
        # Voice tone mapping
        voice_instructions = {
            'professional': 'Write in a professional, authoritative, and trustworthy tone. Use clear business language.',
            'casual': 'Write in a friendly, conversational, and approachable tone. Use everyday language.',
            'playful': 'Write in a fun, creative, and energetic tone. Use humor and wit where appropriate.',
            'technical': 'Write in a precise, data-driven, and expertise-focused tone. Use industry terminology.'
        }

        voice_instruction = voice_instructions.get(brand_voice, voice_instructions['professional'])

        prompt = f"""You are a high-performing copywriter specializing in conversion-focused marketing content.

INPUT:

Product Analysis:
{product_understanding.model_dump_json(indent=2)}

Marketing Strategy:
{marketing_strategy.model_dump_json(indent=2)}

BRAND VOICE:
{voice_instruction}

TASK:
Generate the following marketing content:

1. Ad Copy (5 variations):
   - Short, punchy ad copies (2-3 sentences each)
   - Focus on different messaging angles
   - Include a clear call-to-action

2. Email Sequence (3 emails):
   - Email 1: Introduction/Problem awareness
   - Email 2: Solution introduction
   - Email 3: Social proof and CTA
   - Each email should have subject line and body

3. Landing Page Structure:
   - Headline: Attention-grabbing main headline
   - Subheadline: Supporting headline
   - Sections: 4-5 key sections for the landing page
   - CTA: Clear call-to-action text

RULES:
- Match the {brand_voice} brand voice consistently
- Focus on benefits, not just features
- Use emotional triggers
- Keep it concise and scannable

OUTPUT FORMAT (STRICT JSON):
{{
  "ad_copy": [
    "Ad copy 1 with clear benefit and CTA",
    "Ad copy 2 with different angle",
    "Ad copy 3 focusing on pain point",
    "Ad copy 4 with social proof angle",
    "Ad copy 5 with urgency"
  ],
  "email_sequence": [
    {{
      "email_1": "Subject: [Subject line]\\n\\nHey [Name],\\n\\n[Email body addressing pain point]\\n\\n[Signature]"
    }},
    {{
      "email_2": "Subject: [Subject line]\\n\\nHey [Name],\\n\\n[Email body introducing solution]\\n\\n[Signature]"
    }},
    {{
      "email_3": "Subject: [Subject line]\\n\\nHey [Name],\\n\\n[Email body with social proof and CTA]\\n\\n[Signature]"
    }}
  ],
  "landing_page": {{
    "headline": "Compelling main headline",
    "subheadline": "Supporting subheadline",
    "sections": [
      "Section 1: Problem/Pain point",
      "Section 2: Solution overview",
      "Section 3: Key features/benefits",
      "Section 4: Social proof",
      "Section 5: Final CTA"
    ],
    "cta": "Get Started Free"
  }}
}}

Return ONLY the JSON object, no additional text."""

        result = self._call_gemini(prompt, temperature=0.8)
        return ContentGeneration(**result)

    def step4_social_media(
        self,
        product_understanding: ProductUnderstanding,
        marketing_strategy: MarketingStrategy,
        brand_voice: str = 'professional'
    ) -> SocialMediaPosts:
        """
        Step 4: Generate social media content

        Args:
            product_understanding: Output from step 1
            marketing_strategy: Output from step 2
            brand_voice: Tone of voice (professional, casual, playful, technical)

        Returns:
            SocialMediaPosts object
        """
        voice_instructions = {
            'professional': 'Professional, authoritative, industry-expert tone',
            'casual': 'Friendly, conversational, relatable tone',
            'playful': 'Fun, energetic, creative tone with emojis',
            'technical': 'Precise, data-driven, expertise-focused tone'
        }

        voice_instruction = voice_instructions.get(brand_voice, voice_instructions['professional'])

        prompt = f"""You are a social media expert specializing in viral content and engagement.

INPUT:

Product Analysis:
{product_understanding.model_dump_json(indent=2)}

Marketing Strategy:
{marketing_strategy.model_dump_json(indent=2)}

BRAND VOICE:
{voice_instruction}

TASK:
Generate social media content for multiple platforms:

1. Twitter Thread (4-5 tweets):
   - Each tweet MAX 280 characters
   - Thread format: Hook → Value → Insight → CTA
   - Use line breaks for readability
   - Include relevant emojis if brand voice allows
   - First tweet should be attention-grabbing

2. LinkedIn Posts (3 posts):
   - Thought leadership style
   - 150-200 words each
   - Professional storytelling
   - End with engagement question
   - Focus on business value

3. Instagram Captions (3 captions):
   - Engaging, visual-first copy
   - 100-150 words each
   - Include 10-15 relevant hashtags per caption
   - Include call-to-action
   - Tell a story or share insight

RULES:
- Match the {brand_voice} brand voice
- Make content shareable and engaging
- Focus on value, not just promotion
- Each piece should stand alone
- Character limits are STRICT for Twitter

OUTPUT FORMAT (STRICT JSON):
{{
  "twitter_thread": [
    "Tweet 1: Hook that grabs attention (max 280 chars)",
    "Tweet 2: Key value point (max 280 chars)",
    "Tweet 3: Supporting insight (max 280 chars)",
    "Tweet 4: Social proof or stat (max 280 chars)",
    "Tweet 5: Clear CTA (max 280 chars)"
  ],
  "linkedin_posts": [
    "LinkedIn post 1: Thought leadership angle with story and question",
    "LinkedIn post 2: Different angle, business value focus",
    "LinkedIn post 3: Third angle with engagement hook"
  ],
  "instagram_captions": [
    "Instagram caption 1: Visual story with CTA and hashtags",
    "Instagram caption 2: Different angle with personality and hashtags",
    "Instagram caption 3: Third angle with value and hashtags"
  ]
}}

Return ONLY the JSON object, no additional text."""

        result = self._call_gemini(prompt, temperature=0.7)
        return SocialMediaPosts(**result)

    def step5_seo(
        self,
        product_understanding: ProductUnderstanding,
        marketing_strategy: MarketingStrategy
    ) -> SEOData:
        """
        Step 5: Generate SEO keywords and meta tags

        Args:
            product_understanding: Output from step 1
            marketing_strategy: Output from step 2

        Returns:
            SEOData object
        """
        prompt = f"""You are an SEO expert specializing in search optimization and content strategy.

INPUT:

Product Analysis:
{product_understanding.model_dump_json(indent=2)}

Marketing Strategy:
{marketing_strategy.model_dump_json(indent=2)}

TASK:
Generate SEO optimization data:

1. Keywords (10-15 keywords):
   - Mix of short-tail (1-2 words) and long-tail (3-5 words)
   - Include brand, product type, use case, and benefit keywords
   - Focus on search intent and commercial value
   - Consider buyer journey stages

2. Meta Title (50-60 characters):
   - Include primary keyword
   - Clear value proposition
   - Compelling and clickable
   - Brand name if space allows

3. Meta Description (150-160 characters):
   - Include primary and secondary keywords naturally
   - Clear benefit statement
   - Call-to-action
   - Enticing for click-through

4. Heading Structure (5-7 headings):
   - H1: Main page headline (with primary keyword)
   - H2s: Section headings (with secondary keywords)
   - Logical content hierarchy
   - SEO-optimized but natural

RULES:
- Keywords should be realistic and relevant
- Avoid keyword stuffing
- Focus on user intent
- Meta content must fit character limits exactly
- Headings should guide content structure

OUTPUT FORMAT (STRICT JSON):
{{
  "keywords": [
    "primary keyword phrase",
    "secondary keyword 1",
    "secondary keyword 2",
    "long-tail keyword phrase 1",
    "long-tail keyword phrase 2",
    "use case keyword",
    "benefit keyword",
    "industry keyword",
    "competitor alternative keyword",
    "feature keyword 1",
    "feature keyword 2",
    "pain point keyword",
    "solution keyword",
    "buyer intent keyword",
    "brand + category keyword"
  ],
  "meta_title": "Compelling title with primary keyword (50-60 chars)",
  "meta_description": "Value-driven description with keywords and CTA (150-160 chars)",
  "heading_structure": [
    "H1: Main headline with primary keyword",
    "H2: First section - benefit angle",
    "H2: Second section - feature showcase",
    "H2: Third section - use cases",
    "H2: Fourth section - social proof",
    "H2: Fifth section - pricing/CTA",
    "H2: Sixth section - FAQ or final value"
  ]
}}

Return ONLY the JSON object, no additional text."""

        result = self._call_gemini(prompt, temperature=0.3)
        return SEOData(**result)

    def detect_competitors(
        self,
        product_understanding: ProductUnderstanding,
        marketing_strategy: MarketingStrategy
    ) -> list:
        """
        Use AI to automatically detect likely competitors

        Args:
            product_understanding: Output from step 1
            marketing_strategy: Output from step 2

        Returns:
            List of 2-3 competitor URLs/names
        """
        prompt = f"""You are a market research analyst specializing in competitive intelligence.

YOUR PRODUCT:

Product Analysis:
{product_understanding.model_dump_json(indent=2)}

Marketing Strategy:
{marketing_strategy.model_dump_json(indent=2)}

TASK:
Based on the product description, target audience, and value proposition, identify 2-3 direct competitors in the market.

RULES:
- Focus on DIRECT competitors (same target market, similar product)
- Prefer well-known, established competitors
- Include their primary website URL if known
- If exact URL is unknown, provide company name and best guess URL
- Be realistic and accurate

OUTPUT FORMAT (STRICT JSON):
{{
  "competitors": [
    {{
      "name": "Competitor 1 Name",
      "url": "https://competitor1.com",
      "reason": "Brief reason why this is a competitor"
    }},
    {{
      "name": "Competitor 2 Name",
      "url": "https://competitor2.com",
      "reason": "Brief reason why this is a competitor"
    }},
    {{
      "name": "Competitor 3 Name",
      "url": "https://competitor3.com",
      "reason": "Brief reason why this is a competitor"
    }}
  ]
}}

Return ONLY the JSON object, no additional text."""

        try:
            result = self._call_gemini(prompt, temperature=0.3)
            # Extract URLs from the response
            competitors = result.get('competitors', [])
            competitor_urls = [comp['url'] for comp in competitors if comp.get('url')]

            print(f"AI detected {len(competitor_urls)} competitors:")
            for comp in competitors:
                print(f"  - {comp.get('name')}: {comp.get('url')} ({comp.get('reason')})")

            return competitor_urls[:3]  # Return max 3
        except Exception as e:
            print(f"Warning: Failed to auto-detect competitors: {str(e)}")
            return []

    def step6_competitor_analysis(
        self,
        product_understanding: ProductUnderstanding,
        marketing_strategy: MarketingStrategy,
        competitor_urls: list
    ) -> CompetitorAnalysis:
        """
        Step 6: Analyze competitors and generate differentiation strategy

        Args:
            product_understanding: Output from step 1
            marketing_strategy: Output from step 2
            competitor_urls: List of competitor URLs to analyze

        Returns:
            CompetitorAnalysis object
        """
        # Scrape competitor content
        scraper = WebScraper()
        competitor_data = []

        for url in competitor_urls:
            try:
                scraped = scraper.scrape_url(url)
                # Chunk to reasonable length
                content = scraper.chunk_content(scraped['content'], max_length=2000)
                competitor_data.append({
                    'url': url,
                    'content': content
                })
            except Exception as e:
                print(f"Warning: Failed to scrape {url}: {str(e)}")
                # Add placeholder for failed scrapes
                competitor_data.append({
                    'url': url,
                    'content': f"[Unable to scrape: {url}]"
                })

        # Build competitor analysis prompt
        competitors_text = "\n\n".join([
            f"COMPETITOR {i+1} ({comp['url']}):\n{comp['content']}"
            for i, comp in enumerate(competitor_data)
        ])

        prompt = f"""You are a competitive intelligence analyst and strategy consultant.

YOUR PRODUCT:

Product Analysis:
{product_understanding.model_dump_json(indent=2)}

Marketing Strategy:
{marketing_strategy.model_dump_json(indent=2)}

COMPETITORS:

{competitors_text}

TASK:
Analyze the competitive landscape and provide strategic insights:

1. Competitor Summaries (one for each competitor):
   - Extract company/product name
   - Brief 2-3 sentence summary of what they offer
   - Key positioning

2. Comparison Table:
   - Identify 5-7 key features/attributes to compare
   - For each feature, provide: [Your Product's stance, Competitor 1, Competitor 2, Competitor 3]
   - Use "Yes/No", "High/Medium/Low", or brief descriptive phrases
   - Make it clear and objective

3. Differentiation Strategy:
   - 4-5 specific ways to differentiate from competitors
   - Focus on unique value propositions
   - Be actionable and specific

4. Competitive Advantages:
   - 3-5 areas where your product has clear advantages
   - Based on features, pricing, target market, or approach
   - Be honest and realistic

5. Market Gaps & Opportunities:
   - 3-4 underserved needs or gaps in the market
   - Opportunities competitors are missing
   - Areas to potentially expand into

RULES:
- Be objective and analytical
- Base insights on actual differences
- Don't exaggerate or make unfounded claims
- Focus on strategic positioning
- Provide actionable recommendations

OUTPUT FORMAT (STRICT JSON):
{{
  "competitors": [
    {{
      "name": "Competitor 1 Name",
      "summary": "Brief 2-3 sentence description of what they do and their positioning"
    }},
    {{
      "name": "Competitor 2 Name",
      "summary": "Brief description"
    }},
    {{
      "name": "Competitor 3 Name",
      "summary": "Brief description"
    }}
  ],
  "comparison_table": {{
    "Pricing": ["Your pricing approach", "Competitor 1 pricing", "Competitor 2 pricing", "Competitor 3 pricing"],
    "Target Market": ["Your target", "Comp 1 target", "Comp 2 target", "Comp 3 target"],
    "Key Feature 1": ["Your approach", "Comp 1 approach", "Comp 2 approach", "Comp 3 approach"],
    "Key Feature 2": ["Your approach", "Comp 1 approach", "Comp 2 approach", "Comp 3 approach"],
    "Integration Ecosystem": ["Your integrations", "Comp 1 integrations", "Comp 2 integrations", "Comp 3 integrations"],
    "User Experience": ["Your UX focus", "Comp 1 UX", "Comp 2 UX", "Comp 3 UX"],
    "Unique Selling Point": ["Your USP", "Comp 1 USP", "Comp 2 USP", "Comp 3 USP"]
  }},
  "differentiation_strategy": [
    "Specific differentiation point 1 with reasoning",
    "Specific differentiation point 2 with reasoning",
    "Specific differentiation point 3 with reasoning",
    "Specific differentiation point 4 with reasoning",
    "Specific differentiation point 5 with reasoning"
  ],
  "competitive_advantages": [
    "Clear advantage 1 over competitors",
    "Clear advantage 2 over competitors",
    "Clear advantage 3 over competitors",
    "Clear advantage 4 over competitors"
  ],
  "market_gaps": [
    "Market gap or opportunity 1",
    "Market gap or opportunity 2",
    "Market gap or opportunity 3",
    "Market gap or opportunity 4"
  ]
}}

Return ONLY the JSON object, no additional text."""

        result = self._call_gemini(prompt, temperature=0.4)
        return CompetitorAnalysis(**result)

    def run_pipeline(self, content: str, brand_voice: str = 'professional', competitor_urls: list = None, auto_detect_competitors: bool = False) -> FinalOutput:
        """
        Run the complete 5-step pipeline (6 steps if competitors provided or auto-detected)

        Args:
            content: Cleaned product content
            brand_voice: Brand voice tone (professional, casual, playful, technical)
            competitor_urls: Optional list of competitor URLs to analyze
            auto_detect_competitors: If True, AI will automatically find competitors

        Returns:
            FinalOutput with merged results
        """
        # Step 1: Product Understanding
        print("Running Step 1: Product Understanding...")
        step1_output = self.step1_product_understanding(content)

        # Step 2: Marketing Strategy
        print("Running Step 2: Marketing Strategy...")
        step2_output = self.step2_marketing_strategy(step1_output)

        # Step 3: Content Generation
        print("Running Step 3: Content Generation...")
        step3_output = self.step3_content_generation(step1_output, step2_output, brand_voice)

        # Step 4: Social Media Posts
        print("Running Step 4: Social Media Content...")
        step4_output = self.step4_social_media(step1_output, step2_output, brand_voice)

        # Step 5: SEO Data
        print("Running Step 5: SEO Optimization...")
        step5_output = self.step5_seo(step1_output, step2_output)

        # Step 6: Competitor Analysis (Optional)
        step6_output = None

        # Determine which competitors to analyze
        urls_to_analyze = None
        if auto_detect_competitors:
            print("Running AI Competitor Detection...")
            urls_to_analyze = self.detect_competitors(step1_output, step2_output)
        elif competitor_urls and len(competitor_urls) > 0:
            urls_to_analyze = competitor_urls

        # Run competitor analysis if we have URLs
        if urls_to_analyze and len(urls_to_analyze) > 0:
            print("Running Step 6: Competitor Analysis...")
            step6_output = self.step6_competitor_analysis(step1_output, step2_output, urls_to_analyze)

        # Merge outputs
        final_output = FinalOutput(
            product_summary=step1_output.product_summary,
            target_audience=step1_output.target_audience,
            positioning=step2_output.positioning,
            ad_copy=step3_output.ad_copy,
            email_sequence=step3_output.email_sequence,
            landing_page=step3_output.landing_page.model_dump(),
            social_media={
                'twitter_thread': step4_output.twitter_thread,
                'linkedin_posts': step4_output.linkedin_posts,
                'instagram_captions': step4_output.instagram_captions
            },
            seo={
                'keywords': step5_output.keywords,
                'meta_title': step5_output.meta_title,
                'meta_description': step5_output.meta_description,
                'heading_structure': step5_output.heading_structure
            },
            competitor_analysis={
                'competitors': step6_output.competitors,
                'comparison_table': step6_output.comparison_table,
                'differentiation_strategy': step6_output.differentiation_strategy,
                'competitive_advantages': step6_output.competitive_advantages,
                'market_gaps': step6_output.market_gaps
            } if step6_output else None
        )

        return final_output
