"""
Backend package initialization
Ініціалізація пакету бекенду
"""

from auth_service import (
    create_access_token,
    create_refresh_token,
    validate_telegram_login_widget,
    validate_telegram_webapp_data,
    verify_token,
)
from config import get_settings, Settings
from middleware import (
    JWTAuthMiddleware,
    require_auth,
    get_current_user,
    get_current_user_id,
    extract_bearer_token,
)

__all__ = [
    # Auth Service
    "create_access_token",
    "create_refresh_token",
    "validate_telegram_webapp_data",
    "validate_telegram_login_widget",
    "verify_token",
    # Config
    "get_settings",
    "Settings",
    # Middleware
    "JWTAuthMiddleware",
    "require_auth",
    "get_current_user",
    "get_current_user_id",
    "extract_bearer_token",
]
