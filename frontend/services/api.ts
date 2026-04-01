import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const HEALTH_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

export interface InputRequest {
  input_data: string;
  input_type: 'url' | 'text';
  brand_voice?: 'professional' | 'casual' | 'playful' | 'technical';
  competitor_urls?: string[];
  auto_detect_competitors?: boolean;
}

export interface LandingPage {
  headline: string;
  subheadline: string;
  sections: string[];
  cta: string;
}

export interface EmailItem {
  [key: string]: string;
}

export interface SocialMedia {
  twitter_thread: string[];
  linkedin_posts: string[];
  instagram_captions: string[];
}

export interface SEO {
  keywords: string[];
  meta_title: string;
  meta_description: string;
  heading_structure: string[];
}

export interface CompetitorInfo {
  name: string;
  summary: string;
}

export interface CompetitorAnalysis {
  competitors: CompetitorInfo[];
  comparison_table: { [key: string]: string[] };
  differentiation_strategy: string[];
  competitive_advantages: string[];
  market_gaps: string[];
}

export interface MarketingStrategy {
  product_summary: string;
  target_audience: string;
  positioning: string;
  ad_copy: string[];
  email_sequence: EmailItem[];
  landing_page: LandingPage;
  social_media?: SocialMedia;
  seo?: SEO;
  competitor_analysis?: CompetitorAnalysis;
}

export const api = {
  async generateStrategy(input: InputRequest): Promise<MarketingStrategy> {
    try {
      const response = await axios.post<MarketingStrategy>(
        `${API_BASE_URL}/generate`,
        input,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2 minutes timeout
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Failed to generate strategy');
      } else if (error.request) {
        throw new Error('No response from server. Please ensure the backend is running.');
      } else {
        throw new Error(error.message || 'An error occurred');
      }
    }
  },

  async downloadPDF(data: MarketingStrategy): Promise<void> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate/pdf`,
        data,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'marketing_strategy.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw new Error('Failed to download PDF');
    }
  },

  async healthCheck(): Promise<void> {
    try {
      await axios.get(`${HEALTH_URL}/health`, {
        timeout: 5000,
      });
    } catch (error) {
      // Silent fail - this is just to wake up the backend
      console.log('Backend warming up...');
    }
  },
};
