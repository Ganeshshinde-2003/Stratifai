import requests
from bs4 import BeautifulSoup
from typing import Optional, Dict
import re
from urllib.parse import urlparse


class WebScraper:
    """Web scraper for extracting product content from URLs"""

    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def validate_url(self, url: str) -> bool:
        """Validate if the input is a proper URL"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except Exception:
            return False

    def scrape_url(self, url: str) -> Dict[str, str]:
        """
        Scrape content from a URL

        Args:
            url: The URL to scrape

        Returns:
            Dictionary containing scraped content

        Raises:
            Exception: If scraping fails
        """
        if not self.validate_url(url):
            raise ValueError(f"Invalid URL: {url}")

        try:
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()

            # Extract content
            content = self._extract_content(soup)

            return content

        except requests.RequestException as e:
            raise Exception(f"Failed to fetch URL: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to parse content: {str(e)}")

    def _extract_content(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract structured content from BeautifulSoup object"""

        # Get title
        title = ""
        if soup.title:
            title = soup.title.string
        elif soup.find('h1'):
            title = soup.find('h1').get_text()

        # Get meta description
        meta_description = ""
        meta_tag = soup.find('meta', attrs={'name': 'description'})
        if meta_tag and meta_tag.get('content'):
            meta_description = meta_tag.get('content')

        # Get all headings
        headings = []
        for tag in soup.find_all(['h1', 'h2', 'h3']):
            text = tag.get_text().strip()
            if text:
                headings.append(text)

        # Get paragraphs
        paragraphs = []
        for p in soup.find_all('p'):
            text = p.get_text().strip()
            if text and len(text) > 20:  # Filter out very short paragraphs
                paragraphs.append(text)

        # Clean and combine content
        cleaned_content = self._clean_text(
            f"Title: {title}\n\n"
            f"Description: {meta_description}\n\n"
            f"Headings: {' | '.join(headings[:10])}\n\n"
            f"Content: {' '.join(paragraphs[:20])}"
        )

        return {
            "title": title,
            "description": meta_description,
            "headings": headings[:10],
            "content": cleaned_content
        }

    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters (keep basic punctuation)
        text = re.sub(r'[^\w\s\.\,\!\?\:\;\-\(\)\[\]\{\}]', '', text)
        return text.strip()

    def chunk_content(self, content: str, max_length: int = 4000) -> str:
        """
        Chunk content for LLM processing

        Args:
            content: The content to chunk
            max_length: Maximum length of chunked content

        Returns:
            Chunked content string
        """
        if len(content) <= max_length:
            return content

        # Split by sentences and take the first chunk
        sentences = re.split(r'[.!?]+', content)
        chunked = ""

        for sentence in sentences:
            if len(chunked) + len(sentence) <= max_length:
                chunked += sentence + ". "
            else:
                break

        return chunked.strip()
