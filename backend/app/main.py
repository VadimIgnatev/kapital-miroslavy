from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.api.trades import router as trades_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаём таблицы при запуске
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Капитал Мирославы", lifespan=lifespan)

# CORS — разрешаем фронтенду обращаться к API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trades_router)
