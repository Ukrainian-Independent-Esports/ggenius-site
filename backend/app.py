"""
Sample FastAPI Application with JWT Authentication
Приклад FastAPI застосунку з JWT автентифікацією

This module demonstrates how to use the auth_service and middleware
for a complete authentication flow.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from auth_service import (
    create_access_token,
    create_refresh_token,
    validate_telegram_webapp_data,
    validate_telegram_login_widget,
    verify_token,
    TokenExpiredError,
    InvalidTokenError,
)
from config import get_settings
from middleware import (
    JWTAuthMiddleware,
    get_current_user,
    get_current_user_id,
    require_auth,
)


# ============================================
# FastAPI App Setup / Налаштування FastAPI
# ============================================

app = FastAPI(
    title="GGenius API",
    description="API for GGenius — Ukrainian eSports Platform",
    version="1.0.0",
)

# ============================================
# CORS Configuration / Налаштування CORS
# ============================================

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "*",
        "Authorization",  # Explicitly allow Authorization header
        "Content-Type",
        "Accept",
    ],
    expose_headers=[
        "Authorization",
        "X-Request-Id",
    ],
)

# ============================================
# JWT Middleware / Middleware автентифікації
# ============================================

app.add_middleware(
    JWTAuthMiddleware,
    excluded_paths=[
        "/auth",        # Auth endpoints
        "/public",      # Public endpoints
        "/docs",        # Swagger UI
        "/openapi.json",  # OpenAPI schema
        "/redoc",       # ReDoc
        "/health",      # Health check
        "/",            # Root
    ],
)


# ============================================
# Request/Response Models / Моделі запитів
# ============================================

class TelegramAuthRequest(BaseModel):
    """Request model for Telegram WebApp authentication"""
    init_data: str


class TelegramWidgetAuthRequest(BaseModel):
    """Request model for Telegram Login Widget authentication"""
    id: int
    first_name: str
    auth_date: int
    hash: str
    last_name: str | None = None
    username: str | None = None
    photo_url: str | None = None


class RefreshTokenRequest(BaseModel):
    """Request model for token refresh"""
    refresh_token: str


class TokenResponse(BaseModel):
    """Response model with tokens"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict | None = None


class UserResponse(BaseModel):
    """Response model for user profile"""
    id: int
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None


# ============================================
# Public Endpoints / Публічні ендпоінти
# ============================================

@app.get("/")
async def root():
    """Root endpoint — public"""
    return {"message": "GGenius API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint — public"""
    return {"status": "healthy"}


# ============================================
# Auth Endpoints / Ендпоінти автентифікації
# ============================================

@app.post("/auth/telegram", response_model=TokenResponse)
async def auth_telegram(request: TelegramAuthRequest):
    """
    Authenticate with Telegram WebApp initData
    Автентифікація через Telegram WebApp initData
    """
    settings = get_settings()

    # Validate initData
    validated_data = validate_telegram_webapp_data(
        request.init_data,
        settings.BOT_TOKEN
    )

    if not validated_data:
        raise HTTPException(
            status_code=401,
            detail="Invalid Telegram initData"
        )

    # Extract user info
    user_data = validated_data.get("user", {})
    user_id = user_data.get("id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="User ID not found in initData"
        )

    # Create tokens
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_data,
    )


@app.post("/auth/telegram-widget", response_model=TokenResponse)
async def auth_telegram_widget(request: TelegramWidgetAuthRequest):
    """
    Authenticate with Telegram Login Widget data
    Автентифікація через Telegram Login Widget
    """
    settings = get_settings()

    # Convert to dict for validation
    widget_data = request.model_dump(exclude_none=True)

    # Validate widget data
    is_valid = validate_telegram_login_widget(widget_data, settings.BOT_TOKEN)

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid Telegram Login Widget data"
        )

    user_id = request.id

    # Create tokens
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    user_data = {
        "id": user_id,
        "first_name": request.first_name,
        "last_name": request.last_name,
        "username": request.username,
    }

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_data,
    )


@app.post("/auth/refresh", response_model=TokenResponse)
async def refresh_tokens(request: RefreshTokenRequest):
    """
    Refresh access token using refresh token
    Оновлення access токена через refresh токен
    """
    try:
        # Verify refresh token
        payload = verify_token(request.refresh_token, expected_type="refresh")

        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        user_id = int(payload["sub"])

        # Create new tokens
        new_access_token = create_access_token(user_id)
        new_refresh_token = create_refresh_token(user_id)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
        )

    except TokenExpiredError:
        raise HTTPException(
            status_code=401,
            detail="Refresh token has expired. Please log in again."
        )
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


@app.post("/auth/logout")
async def logout(request: Request):
    """
    Logout — invalidate session
    Вихід — інвалідація сесії
    """
    # In a production app, you would:
    # 1. Blacklist the refresh token
    # 2. Clear any server-side sessions
    # For now, just return success (client will clear tokens)
    return {"message": "Logged out successfully"}


# ============================================
# Protected Endpoints / Захищені ендпоінти
# ============================================

@app.get("/api/user/profile")
async def get_user_profile(request: Request):
    """
    Get current user profile — protected endpoint
    Отримання профілю користувача — захищений ендпоінт

    Requires valid access token in Authorization header
    """
    user = get_current_user(request)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    # In a real app, you would fetch user data from database
    # For now, return user ID from token
    return {
        "user": {
            "id": user.user_id,
            # Add more user data from database here
        }
    }


@app.get("/api/protected")
@require_auth
async def protected_endpoint(request: Request):
    """
    Example protected endpoint using decorator
    Приклад захищеного ендпоінту з декоратором
    """
    user_id = get_current_user_id(request)

    return {
        "message": "This is protected data",
        "user_id": user_id,
    }


# ============================================
# Error Handlers / Обробники помилок
# ============================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent format"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "http_error",
            "message": exc.detail,
        }
    )


# ============================================
# Run Application / Запуск застосунку
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
