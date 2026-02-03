"""
Tests for Authentication Service
Тести для сервісу автентифікації

Tests cover:
- JWT token generation and verification
- Telegram WebApp initData validation
- Telegram Login Widget validation
- Token expiration handling
- Bearer token extraction
"""

import hashlib
import hmac
import json
import os
import time
from datetime import timedelta
from urllib.parse import urlencode

import pytest

# Set up test environment before importing modules
os.environ["SECRET_KEY"] = "test-secret-key-minimum-32-characters-long-for-testing"
os.environ["BOT_TOKEN"] = "123456789:ABCdefGHIjklMNOpqrsTUVwxyz123456789"

from auth_service import (
    AuthenticationError,
    InvalidTokenError,
    TokenExpiredError,
    create_access_token,
    create_refresh_token,
    get_user_id_from_token,
    validate_telegram_login_widget,
    validate_telegram_webapp_data,
    verify_token,
)
from config import get_settings, load_settings
from middleware import extract_bearer_token


class TestConfig:
    """Tests for config.py"""

    def test_settings_loaded(self):
        """Test that settings are properly loaded from environment"""
        settings = get_settings()
        assert settings is not None
        assert settings.SECRET_KEY == "test-secret-key-minimum-32-characters-long-for-testing"
        assert settings.ALGORITHM == "HS256"

    def test_secret_key_length_validation(self):
        """Test that SECRET_KEY length is validated"""
        settings = get_settings()
        assert len(settings.SECRET_KEY) >= 32


class TestJWTTokens:
    """Tests for JWT token creation and verification"""

    def test_create_access_token(self):
        """Test access token creation"""
        user_id = 123456
        token = create_access_token(user_id)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_refresh_token(self):
        """Test refresh token creation"""
        user_id = 123456
        token = create_refresh_token(user_id)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_verify_access_token(self):
        """Test access token verification — critical test"""
        user_id = 123456
        token = create_access_token(user_id)

        # Verify the token
        payload = verify_token(token, expected_type="access")

        assert payload is not None
        assert payload["sub"] == str(user_id)
        assert payload["type"] == "access"
        assert "exp" in payload
        assert "iat" in payload

    def test_verify_refresh_token(self):
        """Test refresh token verification"""
        user_id = 789012
        token = create_refresh_token(user_id)

        payload = verify_token(token, expected_type="refresh")

        assert payload is not None
        assert payload["sub"] == str(user_id)
        assert payload["type"] == "refresh"

    def test_token_type_mismatch(self):
        """Test that verifying with wrong type raises error"""
        user_id = 123456
        access_token = create_access_token(user_id)

        with pytest.raises(InvalidTokenError) as exc_info:
            verify_token(access_token, expected_type="refresh")

        assert "type mismatch" in str(exc_info.value).lower()

    def test_get_user_id_from_token(self):
        """Test extracting user ID from token"""
        user_id = 123456
        token = create_access_token(user_id)

        extracted_id = get_user_id_from_token(token)

        assert extracted_id == user_id

    def test_invalid_token(self):
        """Test that invalid token raises error"""
        with pytest.raises(InvalidTokenError):
            verify_token("invalid.token.here")

    def test_empty_token(self):
        """Test that empty token raises error"""
        with pytest.raises(InvalidTokenError):
            verify_token("")

    def test_custom_expiration(self):
        """Test token with custom expiration"""
        user_id = 123456
        # 1 hour expiration
        token = create_access_token(user_id, expires_delta=timedelta(hours=1))

        payload = verify_token(token, expected_type="access")
        assert payload is not None

    def test_additional_claims(self):
        """Test token with additional claims"""
        user_id = 123456
        additional = {"role": "admin", "permissions": ["read", "write"]}
        token = create_access_token(user_id, additional_claims=additional)

        payload = verify_token(token, expected_type="access")

        assert payload["role"] == "admin"
        assert payload["permissions"] == ["read", "write"]


class TestBearerTokenExtraction:
    """Tests for Bearer token extraction from Authorization header"""

    def test_valid_bearer_token(self):
        """Test extraction of valid Bearer token"""
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test"
        header = f"Bearer {token}"

        extracted = extract_bearer_token(header)

        assert extracted == token

    def test_bearer_case_insensitive(self):
        """Test that Bearer prefix is case-insensitive"""
        token = "test-token"

        # Various case combinations
        assert extract_bearer_token("Bearer test-token") == token
        assert extract_bearer_token("bearer test-token") == token
        assert extract_bearer_token("BEARER test-token") == token
        assert extract_bearer_token("BeArEr test-token") == token

    def test_bearer_with_extra_whitespace(self):
        """Test that whitespace is handled correctly"""
        token = "test-token"

        assert extract_bearer_token("  Bearer test-token  ") == token
        assert extract_bearer_token("Bearer   test-token") == token

    def test_missing_bearer_prefix(self):
        """Test that missing Bearer prefix returns None"""
        assert extract_bearer_token("test-token") is None
        assert extract_bearer_token("Basic test-token") is None

    def test_empty_header(self):
        """Test empty or None header"""
        assert extract_bearer_token(None) is None
        assert extract_bearer_token("") is None
        assert extract_bearer_token("Bearer ") is None
        assert extract_bearer_token("Bearer") is None


class TestTelegramValidation:
    """Tests for Telegram authentication validation"""

    @staticmethod
    def create_valid_webapp_init_data(bot_token: str, user_data: dict) -> str:
        """
        Helper to create valid Telegram WebApp initData for testing
        """
        auth_date = int(time.time())
        user_json = json.dumps(user_data, separators=(",", ":"))

        # Create data without hash
        data = {
            "user": user_json,
            "auth_date": str(auth_date),
            "query_id": "test_query_id",
        }

        # Sort and create data_check_string
        sorted_items = sorted(data.items())
        data_check_string = "\n".join(f"{k}={v}" for k, v in sorted_items)

        # Calculate hash: HMAC_SHA256(HMAC_SHA256("WebAppData", bot_token), data_check_string)
        secret_key = hmac.new(
            key=b"WebAppData",
            msg=bot_token.encode("utf-8"),
            digestmod=hashlib.sha256
        ).digest()

        hash_value = hmac.new(
            key=secret_key,
            msg=data_check_string.encode("utf-8"),
            digestmod=hashlib.sha256
        ).hexdigest()

        # Add hash to data
        data["hash"] = hash_value

        return urlencode(data)

    def test_valid_webapp_data(self):
        """Test validation of valid Telegram WebApp initData"""
        bot_token = os.environ["BOT_TOKEN"]
        user_data = {"id": 123456, "first_name": "Test", "username": "testuser"}

        init_data = self.create_valid_webapp_init_data(bot_token, user_data)

        result = validate_telegram_webapp_data(init_data, bot_token)

        assert result is not None
        assert result["user"]["id"] == 123456

    def test_invalid_hash(self):
        """Test that invalid hash is rejected"""
        bot_token = os.environ["BOT_TOKEN"]
        init_data = "user=%7B%22id%22%3A123%7D&auth_date=1234567890&hash=invalidhash"

        result = validate_telegram_webapp_data(init_data, bot_token)

        assert result is None

    def test_missing_hash(self):
        """Test that missing hash returns None"""
        bot_token = os.environ["BOT_TOKEN"]
        init_data = "user=%7B%22id%22%3A123%7D&auth_date=1234567890"

        result = validate_telegram_webapp_data(init_data, bot_token)

        assert result is None

    def test_empty_init_data(self):
        """Test empty initData"""
        bot_token = os.environ["BOT_TOKEN"]

        assert validate_telegram_webapp_data("", bot_token) is None
        assert validate_telegram_webapp_data(None, bot_token) is None

    def test_empty_bot_token(self):
        """Test empty bot token"""
        assert validate_telegram_webapp_data("data=test", "") is None
        assert validate_telegram_webapp_data("data=test", None) is None

    @staticmethod
    def create_valid_widget_data(bot_token: str, user_data: dict) -> dict:
        """
        Helper to create valid Telegram Login Widget data for testing
        """
        auth_date = int(time.time())
        data = {
            "id": user_data.get("id", 123456),
            "first_name": user_data.get("first_name", "Test"),
            "auth_date": auth_date,
        }

        if "username" in user_data:
            data["username"] = user_data["username"]

        # Sort and create data_check_string
        sorted_items = sorted(data.items())
        data_check_string = "\n".join(f"{k}={v}" for k, v in sorted_items)

        # Calculate hash: HMAC_SHA256(SHA256(bot_token), data_check_string)
        secret = hashlib.sha256(bot_token.encode("utf-8")).digest()

        hash_value = hmac.new(
            key=secret,
            msg=data_check_string.encode("utf-8"),
            digestmod=hashlib.sha256
        ).hexdigest()

        data["hash"] = hash_value

        return data

    def test_valid_widget_data(self):
        """Test validation of valid Telegram Login Widget data"""
        bot_token = os.environ["BOT_TOKEN"]
        user_data = {"id": 123456, "first_name": "Test", "username": "testuser"}

        widget_data = self.create_valid_widget_data(bot_token, user_data)

        result = validate_telegram_login_widget(widget_data, bot_token)

        assert result is True

    def test_invalid_widget_hash(self):
        """Test that invalid widget hash is rejected"""
        bot_token = os.environ["BOT_TOKEN"]
        data = {
            "id": 123456,
            "first_name": "Test",
            "auth_date": int(time.time()),
            "hash": "invalidhash"
        }

        result = validate_telegram_login_widget(data, bot_token)

        assert result is False


class TestEndToEndTokenFlow:
    """End-to-end tests for the complete token flow"""

    def test_full_token_lifecycle(self):
        """
        Test complete token lifecycle:
        1. Create access token
        2. Verify token
        3. Extract user ID
        """
        user_id = 123456

        # Step 1: Create tokens
        access_token = create_access_token(user_id)
        refresh_token = create_refresh_token(user_id)

        # Step 2: Verify tokens
        access_payload = verify_token(access_token, expected_type="access")
        refresh_payload = verify_token(refresh_token, expected_type="refresh")

        # Step 3: Check payloads
        assert access_payload["sub"] == str(user_id)
        assert refresh_payload["sub"] == str(user_id)

        # Step 4: Extract user ID
        assert get_user_id_from_token(access_token) == user_id
        assert get_user_id_from_token(refresh_token, expected_type="refresh") == user_id

    def test_token_with_bearer_prefix_handling(self):
        """
        Test complete flow with Bearer prefix handling
        """
        user_id = 123456

        # Create token
        token = create_access_token(user_id)

        # Simulate Authorization header
        auth_header = f"Bearer {token}"

        # Extract token from header
        extracted_token = extract_bearer_token(auth_header)

        # Verify extracted token
        payload = verify_token(extracted_token, expected_type="access")

        assert payload["sub"] == str(user_id)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
