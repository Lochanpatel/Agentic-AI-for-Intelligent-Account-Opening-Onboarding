from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App config
    APP_NAME: str = "OnboardAI"
    VERSION: str = "v1"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ADMIN_EMAIL: str = "admin@board.ai"
    ADMIN_PASSWORD: str = "secureadmin123"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 10

    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "onboarding_db"

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"

    # Simulation flags
    SIMULATE_OCR: bool = True
    SIMULATE_KYC: bool = True
    SIMULATE_AML: bool = True

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # Institution
    default_institution_id: str = "default"

    # Lowercase aliases used by agent code
    @property
    def simulate_ocr(self) -> bool:
        return self.SIMULATE_OCR

    @property
    def simulate_kyc(self) -> bool:
        return self.SIMULATE_KYC

    @property
    def simulate_aml(self) -> bool:
        return self.SIMULATE_AML

    @property
    def openai_api_key(self) -> str:
        return self.OPENAI_API_KEY

    @property
    def openai_model(self) -> str:
        return self.OPENAI_MODEL

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
