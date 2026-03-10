"""
Конфігурація застосунку — Configuration Management
Завантаження та валідація змінних середовища для JWT автентифікації

This module handles:
- Loading environment variables from .env
- Validating SECRET_KEY is properly set
- Exporting typed configuration object
"""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

# Завантажуємо .env файл з кореневої директорії backend
# Load .env file from the backend root directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Мінімальна довжина SECRET_KEY для безпеки
# Minimum length for SECRET_KEY security
MIN_SECRET_KEY_LENGTH = 32


class ConfigurationError(Exception):
    """Помилка конфігурації / Configuration error"""
    pass


@dataclass
class Settings:
    """
    Налаштування застосунку / Application settings

    Attributes:
        SECRET_KEY: Секретний ключ для JWT токенів
        ALGORITHM: Алгоритм підпису JWT (за замовчуванням HS256)
        ACCESS_TOKEN_EXPIRE_MINUTES: Час життя access токена в хвилинах
        REFRESH_TOKEN_EXPIRE_DAYS: Час життя refresh токена в днях
        BOT_TOKEN: Токен Telegram бота для валідації initData
        CORS_ORIGINS: Дозволені джерела для CORS
    """
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    BOT_TOKEN: str = ""
    CORS_ORIGINS: list[str] = None

    def __post_init__(self):
        if self.CORS_ORIGINS is None:
            self.CORS_ORIGINS = ["*"]


def _validate_secret_key(secret_key: str | None) -> str:
    """
    Валідація SECRET_KEY / Validate SECRET_KEY

    Args:
        secret_key: Значення SECRET_KEY зі змінних середовища

    Returns:
        Валідний SECRET_KEY

    Raises:
        ConfigurationError: Якщо SECRET_KEY не встановлено або занадто короткий
    """
    if not secret_key:
        raise ConfigurationError(
            "SECRET_KEY is not set. Please set it in your .env file. "
            "Generate a secure key using: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
        )

    if secret_key in ("changeme", "secret", "your-secret-key", ""):
        raise ConfigurationError(
            "SECRET_KEY has an insecure default value. "
            "Please generate a secure random key."
        )

    if len(secret_key) < MIN_SECRET_KEY_LENGTH:
        raise ConfigurationError(
            f"SECRET_KEY must be at least {MIN_SECRET_KEY_LENGTH} characters long. "
            f"Current length: {len(secret_key)}"
        )

    return secret_key


def load_settings() -> Settings:
    """
    Завантаження та валідація налаштувань / Load and validate settings

    Returns:
        Settings: Об'єкт з налаштуваннями застосунку

    Raises:
        ConfigurationError: Якщо конфігурація невалідна
    """
    secret_key = _validate_secret_key(os.getenv("SECRET_KEY"))

    # Отримуємо інші налаштування з defaults
    algorithm = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    refresh_token_expire = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))
    bot_token = os.getenv("BOT_TOKEN", "")

    # CORS origins — розділяємо по комі
    cors_origins_str = os.getenv("CORS_ORIGINS", "*")
    cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

    return Settings(
        SECRET_KEY=secret_key,
        ALGORITHM=algorithm,
        ACCESS_TOKEN_EXPIRE_MINUTES=access_token_expire,
        REFRESH_TOKEN_EXPIRE_DAYS=refresh_token_expire,
        BOT_TOKEN=bot_token,
        CORS_ORIGINS=cors_origins,
    )


# Глобальний об'єкт налаштувань — ініціалізується при імпорті
# Global settings object — initialized on import
# Використовуйте try/except для graceful handling в тестах
try:
    settings = load_settings()
except ConfigurationError:
    # У випадку помилки конфігурації, створюємо placeholder
    # This allows imports to work but will fail on actual usage
    settings = None  # type: ignore


def get_settings() -> Settings:
    """
    Отримання налаштувань з валідацією / Get settings with validation

    Returns:
        Settings: Валідний об'єкт налаштувань

    Raises:
        ConfigurationError: Якщо налаштування не ініціалізовані
    """
    global settings
    if settings is None:
        settings = load_settings()
    return settings
