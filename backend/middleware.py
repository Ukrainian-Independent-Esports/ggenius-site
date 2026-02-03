"""
Middleware для автентифікації — Authentication Middleware
Перевірка JWT токенів та ін'єкція користувача в request context

This module provides:
- Bearer token extraction from Authorization header
- JWT token verification
- User injection into request state
- Proper error responses for authentication failures
"""

from dataclasses import dataclass
from functools import wraps
from typing import Any, Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from auth_service import (
    AuthenticationError,
    InvalidTokenError,
    TokenExpiredError,
    get_user_id_from_token,
    verify_token,
)


# HTTP статус коди для відповідей / HTTP status codes for responses
HTTP_401_UNAUTHORIZED = 401
HTTP_403_FORBIDDEN = 403


@dataclass
class AuthenticatedUser:
    """
    Автентифікований користувач / Authenticated user

    Attributes:
        user_id: ID користувача з токена
        token_payload: Повний payload JWT токена
    """
    user_id: int
    token_payload: dict[str, Any]


def extract_bearer_token(authorization_header: str | None) -> str | None:
    """
    Витягування токена з Authorization header
    Extract Bearer token from Authorization header

    Handles:
    - "Bearer <token>" format
    - Whitespace normalization
    - Case-insensitive "Bearer" prefix

    Args:
        authorization_header: Value of Authorization header

    Returns:
        str: Token without prefix, or None if not found/invalid
    """
    if not authorization_header:
        return None

    # Нормалізуємо whitespace
    auth_header = authorization_header.strip()

    # Перевіряємо prefix "Bearer " (case-insensitive)
    if not auth_header.lower().startswith("bearer "):
        return None

    # Видаляємо "Bearer " prefix (7 символів)
    token = auth_header[7:].strip()

    # Перевіряємо, що токен не порожній
    if not token:
        return None

    return token


def create_error_response(
    status_code: int,
    error: str,
    message: str,
    detail: str | None = None
) -> JSONResponse:
    """
    Створення стандартизованої відповіді про помилку
    Create standardized error response

    Args:
        status_code: HTTP status code
        error: Error type identifier
        message: Human-readable message
        detail: Additional error details (optional)

    Returns:
        JSONResponse with error information
    """
    content = {
        "success": False,
        "error": error,
        "message": message,
    }
    if detail:
        content["detail"] = detail

    return JSONResponse(
        status_code=status_code,
        content=content,
        headers={
            "WWW-Authenticate": "Bearer",
            "Content-Type": "application/json",
        }
    )


class JWTAuthMiddleware(BaseHTTPMiddleware):
    """
    JWT Authentication Middleware для FastAPI/Starlette

    Перевіряє токен у кожному запиті до захищених endpoints
    та додає об'єкт користувача до request.state

    Usage in FastAPI:
        app.add_middleware(JWTAuthMiddleware, excluded_paths=["/auth", "/public"])
    """

    def __init__(self, app, excluded_paths: list[str] | None = None):
        """
        Initialize middleware

        Args:
            app: ASGI application
            excluded_paths: List of path prefixes that don't require authentication
        """
        super().__init__(app)
        self.excluded_paths = excluded_paths or [
            "/auth",
            "/public",
            "/docs",
            "/openapi.json",
            "/health",
        ]

    def is_path_excluded(self, path: str) -> bool:
        """Check if path should skip authentication"""
        for excluded in self.excluded_paths:
            if path.startswith(excluded):
                return True
        return False

    async def dispatch(self, request: Request, call_next):
        """
        Process each request

        1. Check if path is excluded
        2. Extract Bearer token from header
        3. Verify token
        4. Add user to request.state
        5. Call next handler
        """
        # Пропускаємо excluded paths
        if self.is_path_excluded(request.url.path):
            return await call_next(request)

        # OPTIONS запити (preflight) пропускаємо
        if request.method == "OPTIONS":
            return await call_next(request)

        # Витягуємо токен з header
        auth_header = request.headers.get("Authorization")
        token = extract_bearer_token(auth_header)

        if not token:
            return create_error_response(
                status_code=HTTP_401_UNAUTHORIZED,
                error="missing_token",
                message="Authorization header is missing or invalid",
                detail="Expected format: 'Authorization: Bearer <token>'"
            )

        try:
            # Верифікуємо токен
            payload = verify_token(token, expected_type="access")

            if not payload:
                return create_error_response(
                    status_code=HTTP_401_UNAUTHORIZED,
                    error="invalid_token",
                    message="Token verification failed"
                )

            # Витягуємо user_id
            user_id_str = payload.get("sub")
            if not user_id_str:
                return create_error_response(
                    status_code=HTTP_401_UNAUTHORIZED,
                    error="invalid_token",
                    message="Token missing subject claim"
                )

            # Додаємо користувача до request.state
            request.state.user = AuthenticatedUser(
                user_id=int(user_id_str),
                token_payload=payload
            )

            # Продовжуємо обробку запиту
            return await call_next(request)

        except TokenExpiredError:
            return create_error_response(
                status_code=HTTP_401_UNAUTHORIZED,
                error="token_expired",
                message="Access token has expired",
                detail="Please refresh your token using the refresh endpoint"
            )

        except InvalidTokenError as e:
            return create_error_response(
                status_code=HTTP_401_UNAUTHORIZED,
                error="invalid_token",
                message="Token validation failed",
                detail=str(e)
            )

        except AuthenticationError as e:
            return create_error_response(
                status_code=HTTP_401_UNAUTHORIZED,
                error="authentication_error",
                message="Authentication failed",
                detail=str(e)
            )


def require_auth(func: Callable) -> Callable:
    """
    Декоратор для захисту endpoint'ів
    Decorator to protect endpoints that require authentication

    Usage:
        @app.get("/protected")
        @require_auth
        async def protected_endpoint(request: Request):
            user = request.state.user
            ...

    Note: Works best with JWTAuthMiddleware, but can be used standalone
    """
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        # Перевіряємо чи є користувач в state (встановлений middleware)
        if not hasattr(request.state, "user") or request.state.user is None:
            # Спробуємо аутентифікувати якщо middleware не встановив
            auth_header = request.headers.get("Authorization")
            token = extract_bearer_token(auth_header)

            if not token:
                return create_error_response(
                    status_code=HTTP_401_UNAUTHORIZED,
                    error="missing_token",
                    message="Authentication required"
                )

            try:
                payload = verify_token(token, expected_type="access")
                if not payload:
                    return create_error_response(
                        status_code=HTTP_401_UNAUTHORIZED,
                        error="invalid_token",
                        message="Token verification failed"
                    )

                user_id_str = payload.get("sub")
                if not user_id_str:
                    return create_error_response(
                        status_code=HTTP_401_UNAUTHORIZED,
                        error="invalid_token",
                        message="Token missing subject claim"
                    )

                request.state.user = AuthenticatedUser(
                    user_id=int(user_id_str),
                    token_payload=payload
                )

            except TokenExpiredError:
                return create_error_response(
                    status_code=HTTP_401_UNAUTHORIZED,
                    error="token_expired",
                    message="Token has expired"
                )
            except InvalidTokenError as e:
                return create_error_response(
                    status_code=HTTP_401_UNAUTHORIZED,
                    error="invalid_token",
                    message=str(e)
                )

        return await func(request, *args, **kwargs)

    return wrapper


def get_current_user(request: Request) -> AuthenticatedUser | None:
    """
    Отримання поточного користувача з request
    Get current authenticated user from request

    Args:
        request: Starlette/FastAPI Request object

    Returns:
        AuthenticatedUser or None if not authenticated
    """
    if hasattr(request.state, "user"):
        return request.state.user
    return None


def get_current_user_id(request: Request) -> int | None:
    """
    Отримання ID поточного користувача
    Get current user ID from request

    Args:
        request: Starlette/FastAPI Request object

    Returns:
        User ID or None if not authenticated
    """
    user = get_current_user(request)
    return user.user_id if user else None
