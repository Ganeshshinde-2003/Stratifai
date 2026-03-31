from pydantic import BaseModel, validator
from typing import List, Dict, Optional, Union


class InputRequest(BaseModel):
    """Request model for marketing strategy generation"""
    input_data: str
    input_type: str  # 'url' or 'text'
    brand_voice: Optional[str] = 'professional'  # 'professional', 'casual', 'playful', 'technical'
    competitor_urls: Optional[List[str]] = None  # Optional list of 2-3 competitor URLs
    auto_detect_competitors: Optional[bool] = False  # Let AI find competitors automatically

    @validator('input_type')
    def validate_input_type(cls, v):
        if v not in ['url', 'text']:
            raise ValueError('input_type must be either "url" or "text"')
        return v

    @validator('brand_voice')
    def validate_brand_voice(cls, v):
        valid_voices = ['professional', 'casual', 'playful', 'technical']
        if v and v not in valid_voices:
            raise ValueError(f'brand_voice must be one of {valid_voices}')
        return v or 'professional'

    @validator('input_data')
    def validate_input_data(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('input_data cannot be empty')
        return v.strip()

    @validator('competitor_urls')
    def validate_competitor_urls(cls, v):
        if v is not None:
            # Filter out empty strings
            v = [url.strip() for url in v if url and url.strip()]
            if len(v) > 3:
                raise ValueError('Maximum 3 competitor URLs allowed')
            return v if v else None
        return None


class ProductUnderstanding(BaseModel):
    """Step 1 output: Product understanding"""
    product_summary: str
    target_audience: str
    key_features: List[str]
    value_proposition: str
    pain_points: List[str]


class MarketingStrategy(BaseModel):
    """Step 2 output: Marketing strategy"""
    icp: str
    positioning: str
    marketing_pain_points: List[str]
    messaging_angles: List[str]

    @validator('icp', pre=True)
    def validate_icp(cls, v):
        """Handle both string and dict inputs for ICP field"""
        if isinstance(v, dict):
            # Convert dict to formatted string
            parts = []
            for key, value in v.items():
                # Convert snake_case to Title Case
                formatted_key = key.replace('_', ' ').title()
                parts.append(f"{formatted_key}: {value}")
            return "; ".join(parts)
        elif isinstance(v, str):
            return v
        else:
            raise ValueError(f'icp must be either a string or dict, got {type(v)}')


class LandingPage(BaseModel):
    """Landing page structure"""
    headline: str
    subheadline: str
    sections: List[str]
    cta: str


class ContentGeneration(BaseModel):
    """Step 3 output: Content generation"""
    ad_copy: List[str]
    email_sequence: List[Dict[str, str]]
    landing_page: LandingPage


class SocialMediaPosts(BaseModel):
    """Social media posts"""
    twitter_thread: List[str]
    linkedin_posts: List[str]
    instagram_captions: List[str]


class SEOData(BaseModel):
    """SEO keywords and meta tags"""
    keywords: List[str]
    meta_title: str
    meta_description: str
    heading_structure: List[str]


class CompetitorAnalysis(BaseModel):
    """Competitor analysis and differentiation"""
    competitors: List[Dict[str, str]]  # List of {name, summary} for each competitor
    comparison_table: Dict[str, List[str]]  # Feature comparison: {feature: [your_product, comp1, comp2, comp3]}
    differentiation_strategy: List[str]  # Key differentiation points
    competitive_advantages: List[str]  # Your unique advantages
    market_gaps: List[str]  # Opportunities in the market


class FinalOutput(BaseModel):
    """Final merged marketing strategy output"""
    product_summary: str
    target_audience: str
    positioning: str
    ad_copy: List[str]
    email_sequence: List[Dict[str, str]]
    landing_page: Dict[str, Union[str, List[str]]]
    social_media: Optional[Dict[str, List[str]]] = None
    seo: Optional[Dict[str, Union[str, List[str]]]] = None
    competitor_analysis: Optional[Dict[str, Union[List[str], List[Dict[str, str]], Dict[str, List[str]]]]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "product_summary": "A SaaS tool that helps...",
                "target_audience": "B2B SaaS founders...",
                "positioning": "The fastest way to...",
                "ad_copy": ["Ad 1...", "Ad 2..."],
                "email_sequence": [
                    {"email_1": "Subject: ..."},
                    {"email_2": "Subject: ..."},
                    {"email_3": "Subject: ..."}
                ],
                "landing_page": {
                    "headline": "Transform your...",
                    "subheadline": "Stop wasting...",
                    "sections": ["Section 1...", "Section 2..."],
                    "cta": "Get Started Free"
                }
            }
        }


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None
