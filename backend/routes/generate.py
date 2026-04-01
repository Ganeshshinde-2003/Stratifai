from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import InputRequest, FinalOutput, ErrorResponse
from services.scraper import WebScraper
from services.llm_pipeline import LLMPipeline
from services.pdf_generator import PDFGenerator
import os
from typing import Dict, Any

router = APIRouter()

# Initialize services
scraper = WebScraper()
pdf_generator = PDFGenerator()


@router.post("/generate", response_model=FinalOutput)
async def generate_marketing_strategy(request: InputRequest) -> FinalOutput:
    """
    Generate complete marketing strategy from URL or text input

    This endpoint:
    1. Validates input
    2. Scrapes content if URL is provided
    3. Runs 3-step LLM pipeline
    4. Returns merged marketing strategy

    Args:
        request: InputRequest containing input_data and input_type

    Returns:
        FinalOutput: Complete marketing strategy

    Raises:
        HTTPException: If processing fails
    """
    try:
        # Step 1: Process input
        if request.input_type == "url":
            # Scrape URL
            try:
                scraped_data = scraper.scrape_url(request.input_data)
                content = scraped_data['content']
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to scrape URL: {str(e)}"
                )
        else:
            # Use text input directly
            content = request.input_data

        # Chunk content if needed
        chunked_content = scraper.chunk_content(content, max_length=4000)

        if not chunked_content or len(chunked_content.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Input content is too short or empty. Please provide more detailed information."
            )

        # Step 2: Run LLM pipeline
        try:
            llm_pipeline = LLMPipeline()
            final_output = llm_pipeline.run_pipeline(
                chunked_content,
                brand_voice=request.brand_voice or 'professional',
                competitor_urls=request.competitor_urls,
                auto_detect_competitors=request.auto_detect_competitors or False
            )
        except ValueError as e:
            raise HTTPException(
                status_code=500,
                detail=f"LLM API configuration error: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate marketing strategy: {str(e)}"
            )

        return final_output

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/generate/pdf")
async def generate_pdf(data: Dict[str, Any]):
    """
    Generate PDF from marketing strategy data

    Args:
        data: Marketing strategy data dictionary

    Returns:
        StreamingResponse: PDF file
    """
    try:
        pdf_buffer = pdf_generator.generate_pdf(data)

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=marketing_strategy_{data.get('product_summary', 'report')[:20]}.pdf"
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate PDF: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Stratifai",
        "version": "1.1.0"
    }
