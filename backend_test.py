import requests
import sys
import json
from datetime import datetime

class BeautyAPITester:
    def __init__(self, base_url="https://beauty-landing-22.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                    print(f"   Response: {json.dumps(result['response_data'], indent=2)}")
                except:
                    result["response_data"] = response.text
                    print(f"   Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    result["error"] = error_data
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    result["error"] = response.text
                    print(f"   Error: {response.text}")

            self.test_results.append(result)
            return success, result.get("response_data", {})

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_contact_form_submission(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test Felhasználó",
            "email": "test@example.com",
            "phone": "+36301234567",
            "message": "Ez egy teszt üzenet a kapcsolatfelvételi űrlapról."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=contact_data
        )
        
        if success and response:
            if response.get('success') and 'Köszönjük' in response.get('message', ''):
                print("✅ Contact form response message is correct")
                return True, response.get('id')
            else:
                print("❌ Contact form response format incorrect")
                return False, None
        return False, None

    def test_contact_form_validation(self):
        """Test contact form validation with invalid data"""
        invalid_data = {
            "name": "A",  # Too short
            "email": "invalid-email",  # Invalid email
            "message": "Short"  # Too short
        }
        
        return self.run_test(
            "Contact Form Validation",
            "POST",
            "contact",
            422,  # Validation error
            data=invalid_data
        )

    def test_get_contact_messages(self):
        """Test getting contact messages (admin endpoint)"""
        return self.run_test("Get Contact Messages", "GET", "contact", 200)

    def test_status_check_creation(self):
        """Test status check creation"""
        status_data = {
            "client_name": "Test Client"
        }
        
        return self.run_test(
            "Status Check Creation",
            "POST",
            "status",
            200,
            data=status_data
        )

    def test_get_status_checks(self):
        """Test getting status checks"""
        return self.run_test("Get Status Checks", "GET", "status", 200)

def main():
    print("🚀 Starting ANITA Art of Beauty API Tests")
    print("=" * 50)
    
    tester = BeautyAPITester()
    
    # Test API endpoints
    print("\n📡 Testing API Endpoints...")
    
    # Test API root
    tester.test_api_root()
    
    # Test contact form functionality
    print("\n📝 Testing Contact Form...")
    contact_success, contact_id = tester.test_contact_form_submission()
    
    # Test contact form validation
    tester.test_contact_form_validation()
    
    # Test getting contact messages
    tester.test_get_contact_messages()
    
    # Test status check endpoints
    print("\n📊 Testing Status Check Endpoints...")
    tester.test_status_check_creation()
    tester.test_get_status_checks()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        
        # Print failed tests
        failed_tests = [test for test in tester.test_results if not test['success']]
        if failed_tests:
            print("\n❌ Failed Tests:")
            for test in failed_tests:
                print(f"   - {test['test_name']}: {test.get('error', 'Status code mismatch')}")
        
        return 1

if __name__ == "__main__":
    sys.exit(main())