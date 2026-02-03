"""
Сервіс автентифікації — Authentication Service
JWT токени та валідація Telegram Web App initData

This module provides:
- Telegram WebApp initData validation using HMAC-SHA256
- Telegram Login Widget validation
- JWT Access Token generation (15 min default)
- JWT Refresh Token generation (30 days default)
- Token verification with proper error handling
"""

import hashlib
import hmac
import time
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import parse_qsl, unquote

from jose import ExpiredSignatureError, JWTError, jwt

from config import get_settings


class AuthenticationError(Exception):
    """Помилка автентифікації / Authentication error"""
    pass


class TokenExpiredError(AuthenticationError):
    """Токен прострочено / Token has expired"""
    pass


class InvalidTokenError(AuthenticationError):
    """Невалідний токен / Invalid token"""
    pass


def validate_telegram_webapp_data(init_data: str, bot_token: str) -> dict[str, Any] | None:
    """
    Валідація initData з Telegram Web App
    Validate initData from Telegram Web App using HMAC-SHA256

    Algorithm (as per Telegram docs):
    1. Parse init_data as query string
    2. Extract 'hash' parameter
    3. Sort remaining params alphabetically
    4. Create data_check_string: "key=value\nkey=value\n..."
    5. secret_key = HMAC_SHA256("WebAppData", bot_token)
    6. computed_hash = HMAC_SHA256(secret_key, data_check_string)
    7. Compare computed_hash with received hash

    Args:
        init_data: Raw initData string from Telegram WebApp
        bot_token: Bot token from BotFather

    Returns:
        dict: Parsed user data if valid, None if invalid
    """
    if not init_data or not bot_token:
        return None

    try:
        # Парсимо initData як query string
        # Parse initData as query string
        parsed_data = dict(parse_qsl(init_data, keep_blank_values=True))

        # Витягуємо hash
        received_hash = parsed_data.pop("hash", None)
        if not received_hash:
            return None

        # Сортуємо параметри за алфавітом та створюємо data_check_string
        # Sort parameters alphabetically and create data_check_string
        sorted_items = sorted(parsed_data.items())
        data_check_string = "\n".join(f"{k}={v}" for k, v in sorted_items)

        # Обчислюємо secret_key: HMAC_SHA256("WebAppData", bot_token)
        # Calculate secret_key: HMAC_SHA256("WebAppData", bot_token)
        secret_key = hmac.new(
            key=b"WebAppData",
            msg=bot_token.encode("utf-8"),
            digestmod=hashlib.sha256
        ).digest()

        # Обчислюємо hash: HMAC_SHA256(secret_key, data_check_string)
        # Calculate hash: HMAC_SHA256(secret_key, data_check_string)
        computed_hash = hmac.new(
            key=secret_key,
            msg=data_check_string.encode("utf-8"),
            digestmod=hashlib.sha256
        ).hexdigest()

        # Порівнюємо хеші (constant-time comparison)
        # Compare hashes using constant-time comparison
        if not hmac.compare_digest(computed_hash, received_hash):
            return None

        # Перевіряємо auth_date на свіжість (опціонально, 24 години)
        # Check auth_date freshness (optional, 24 hours)
        auth_date_str = parsed_data.get("auth_date")
        if auth_date_str:
            auth_date = int(auth_date_str)
            current_time = int(time.time())
            # Дозволяємо 24 години з моменту автентифікації
            if current_time - auth_date > 86400:  # 24 * 60 * 60
                return None

        # Парсимо user JSON якщо є
        # Parse user JSON if present
        import json
        user_data = parsed_data.get("user")
        if user_data:
            parsed_data["user"] = json.loads(unquote(user_data))

        return parsed_data

    except (ValueError, KeyError, json.JSONDecodeError):
        return None


def validate_telegram_login_widget(data: dict[str, Any], bot_token: str) -> bool:
    """
    Валідація даних з Telegram Login Widget
    Validate data from Telegram Login Widget

    Algorithm:
    1. Extract 'hash' from data
    2. Create data_check_string from remaining sorted params
    3. secret = SHA256(bot_token)
    4. computed_hash = HMAC_SHA256(secret, data_check_string)
    5. Compare hashes

    Args:
        data: Dictionary with user data from Login Widget
        bot_token: Bot token from BotFather

    Returns:
        bool: True if data is valid, False otherwise
    """
    if not data or not bot_token:
        return False

    try:
        # Копіюємо дані, щоб не модифікувати оригінал
        data = dict(data)
        received_hash = data.pop("hash", None)
        if not received_hash:
            return False

        # Перевіряємо auth_date
        auth_date = data.get("auth_date")
        if auth_date:
            auth_date_int = int(auth_date)
            current_time = int(time.time())
            # 24 години валідності
            if current_time - auth_date_int > 86400:
                return False

        # Сортуємо та створюємо data_check_string
        sorted_items = sorted(data.items())
        data_check_string = "\n".join(f"{k}={v}" for k, v in sorted_items)

        # Secret key = SHA256(bot_token) для Login Widget
        secret = hashlib.sha256(bot_token.encode("utf-8")).digest()

        # Обчислюємо hash
        computed_hash = hmac.new(
            key=secret,
            msg=data_check_string.encode("utf-8"),
            digestmod=hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(computed_hash, received_hash)

    except (ValueError, KeyError):
        return False


def create_access_token(
    user_id: int,
    expires_delta: timedelta | None = None,
    additional_claims: dict[str, Any] | None = None
) -> str:
    """
    Створення Access Token / Create Access Token

    Args:
        user_id: ID користувача
        expires_delta: Час життя токена (за замовчуванням 15 хвилин)
        additional_claims: Додаткові claims для payload

    Returns:
        str: Закодований JWT токен
    """
    settings = get_settings()

    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    now = datetime.now(timezone.utc)
    expire = now + expires_delta

    payload = {
        "sub": str(user_id),  # Subject — ID користувача як string
        "exp": expire,        # Expiration time
        "iat": now,          # Issued at
        "type": "access",    # Token type
    }

    # Додаємо додаткові claims якщо є
    if additional_claims:
        payload.update(additional_claims)

    # Кодуємо JWT з явно вказаним алгоритмом HS256
    # Encode JWT with explicitly specified HS256 algorithm
    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM  # Explicitly HS256
    )

    return token


def create_refresh_token(
    user_id: int,
    expires_delta: timedelta | None = None
) -> str:
    """
    Створення Refresh Token / Create Refresh Token

    Args:
        user_id: ID користувача
        expires_delta: Час життя токена (за замовчуванням 30 днів)

    Returns:
        str: Закодований JWT refresh токен
    """
    settings = get_settings()

    if expires_delta is None:
        expires_delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    now = datetime.now(timezone.utc)
    expire = now + expires_delta

    payload = {
        "sub": str(user_id),  # Subject — ID користувача
        "exp": expire,        # Expiration time
        "iat": now,          # Issued at
        "type": "refresh",   # Token type — refresh
    }

    # Кодуємо JWT з явно вказаним алгоритмом HS256
    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM  # Explicitly HS256
    )

    return token


def verify_token(token: str, expected_type: str | None = None) -> dict[str, Any] | None:
    """
    Верифікація JWT токена / Verify JWT token

    Args:
        token: JWT токен для верифікації
        expected_type: Очікуваний тип токена ("access" або "refresh")

    Returns:
        dict: Payload токена якщо валідний, None якщо невалідний

    Raises:
        TokenExpiredError: Якщо токен прострочено
        InvalidTokenError: Якщо токен невалідний
    """
    settings = get_settings()

    if not token:
        raise InvalidTokenError("Token is required")

    try:
        # Декодуємо JWT з явно вказаним алгоритмом HS256
        # Decode JWT with explicitly specified HS256 algorithm
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]  # Explicitly [HS256] — list is required
        )

        # Перевіряємо тип токена якщо вказано
        if expected_type:
            token_type = payload.get("type")
            if token_type != expected_type:
                raise InvalidTokenError(
                    f"Token type mismatch. Expected: {expected_type}, got: {token_type}"
                )

        return payload

    except ExpiredSignatureError:
        raise TokenExpiredError("Token has expired")
    except JWTError as e:
        raise InvalidTokenError(f"Invalid token: {str(e)}")


def get_user_id_from_token(token: str, expected_type: str = "access") -> int | None:
    """
    Витягування user_id з токена / Extract user_id from token

    Args:
        token: JWT токен
        expected_type: Очікуваний тип токена

    Returns:
        int: ID користувача або None якщо невалідний
    """
    try:
        payload = verify_token(token, expected_type)
        if payload:
            user_id_str = payload.get("sub")
            if user_id_str:
                return int(user_id_str)
    except AuthenticationError:
        pass
    return None
