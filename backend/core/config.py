from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App config
    APP_NAME: str = "OnboardAI"
    VERSION: str = "v1"
    ENVIRONMENT: str = "development"
    APP_SECRET: str = "super-secret-key-change-in-prod"
    ADMIN_EMAIL: str = "admin@board.ai"
    ADMIN_PASSWORD: str = "secureadmin123"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 10

    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db: str = "onboarding_db"

    # OpenAI
    openai_api_key: str = ""
    openai_model: str = "gpt-4o"

    # Simulation flags
    simulate_ocr: bool = True
    simulate_kyc: bool = True
    simulate_aml: bool = True

    # CORS
    allowed_origins: str = "http://localhost:3000,http://localhost:5173"

    # Institution
    default_institution_id: str = "default"

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
