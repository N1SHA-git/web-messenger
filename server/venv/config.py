from pydantic_settings import BaseSettings, SettingsConfigDict  # type: ignore
import cloudinary
import os

class Settings(BaseSettings):
    # 🔹 Настройки базы данных
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    SECRET_KEY: str
    DATABASE_URL: str

    # 🔹 Настройки Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # 🔹 URL для подключения к БД (asyncpg и psycopg)
    @property
    def DATABASE_URL_asyncpg(self):
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def DATABASE_URL_psycopg(self):
        return f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # 🔹 Конфигурация загрузки переменных из .env
    model_config = SettingsConfigDict(env_file=".env")

    # 🔹 Метод для инициализации Cloudinary
    def cloudinary_config(self):
        cloudinary.config(
            cloud_name=self.CLOUDINARY_CLOUD_NAME,
            api_key=self.CLOUDINARY_API_KEY,
            api_secret=self.CLOUDINARY_API_SECRET,
            secure=True
        )

# Создаём объект настроек
settings = Settings()

# Инициализируем Cloudinary
settings.cloudinary_config()
