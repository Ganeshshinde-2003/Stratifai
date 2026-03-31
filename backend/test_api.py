"""
Sample script to test the API endpoints
Run this after starting the backend server to verify everything works
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"


def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL.replace('/api', '')}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    return response.status_code == 200


def test_generate_from_url():
    """Test strategy generation from URL"""
    print("Testing strategy generation from URL...")

    data = {
        "input_data": "https://www.stripe.com",
        "input_type": "url"
    }

    print(f"Sending request with data: {json.dumps(data, indent=2)}")
    print("This may take 30-60 seconds...\n")

    try:
        response = requests.post(
            f"{BASE_URL}/generate",
            json=data,
            timeout=120
        )

        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("\n=== RESULTS ===")
            print(f"Product Summary: {result['product_summary'][:100]}...")
            print(f"Target Audience: {result['target_audience'][:100]}...")
            print(f"Number of Ad Copies: {len(result['ad_copy'])}")
            print(f"Number of Emails: {len(result['email_sequence'])}")
            print(f"Landing Page Headline: {result['landing_page']['headline']}")
            return True
        else:
            print(f"Error: {response.json()}")
            return False

    except Exception as e:
        print(f"Error: {str(e)}")
        return False


def test_generate_from_text():
    """Test strategy generation from text"""
    print("\nTesting strategy generation from text...")

    data = {
        "input_data": """
        Our product is a cloud-based project management tool designed for remote teams.
        It features real-time collaboration, task tracking, time management, and integrations
        with popular tools like Slack, Google Drive, and GitHub. The main benefits are
        improved team productivity, better project visibility, and seamless remote collaboration.
        Our target users are small to medium-sized tech companies and startups.
        """,
        "input_type": "text"
    }

    print(f"Sending request with text input...")
    print("This may take 30-60 seconds...\n")

    try:
        response = requests.post(
            f"{BASE_URL}/generate",
            json=data,
            timeout=120
        )

        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("\n=== RESULTS ===")
            print(f"Product Summary: {result['product_summary'][:100]}...")
            print(f"Positioning: {result['positioning'][:100]}...")
            print(f"First Ad Copy: {result['ad_copy'][0][:100]}...")
            return True
        else:
            print(f"Error: {response.json()}")
            return False

    except Exception as e:
        print(f"Error: {str(e)}")
        return False


def main():
    print("=" * 60)
    print("AI Marketing Intelligence Engine - API Test")
    print("=" * 60)
    print()

    # Test health check
    if not test_health_check():
        print("Health check failed! Is the server running?")
        return

    print("\nChoose a test to run:")
    print("1. Test with URL (Stripe.com)")
    print("2. Test with text description")
    print("3. Run both tests")
    print("0. Exit")

    choice = input("\nEnter choice (0-3): ").strip()

    if choice == "1":
        test_generate_from_url()
    elif choice == "2":
        test_generate_from_text()
    elif choice == "3":
        test_generate_from_url()
        test_generate_from_text()
    else:
        print("Exiting...")

    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
