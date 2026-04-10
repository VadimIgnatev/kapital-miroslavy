from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.trade import Trade

router = APIRouter()

# Разрешённые тикеры (жёстко заданы)
ALLOWED_TICKERS = [
    # exporters
    "NVTK", "GMKN", "PLZL", "PHOR", "CHMF", "NLMK",
    # dividend
    "LKOH", "SIBN", "MTSS", "SBER",
    # crypto
    "BTC", "ETH",
]


class TradeCreate(BaseModel):
    ticker: str
    quantity: float
    price: float
    date: date

    @field_validator("ticker")
    @classmethod
    def ticker_must_be_allowed(cls, v: str) -> str:
        v = v.upper()
        if v not in ALLOWED_TICKERS:
            raise ValueError(f"Тикер '{v}' не разрешён. Допустимые: {ALLOWED_TICKERS}")
        return v


class TradeOut(BaseModel):
    id: int
    ticker: str
    quantity: float
    price: float
    date: date

    model_config = {"from_attributes": True}


@router.post("/trades", response_model=TradeOut)
def create_trade(trade: TradeCreate, db: Session = Depends(get_db)):
    db_trade = Trade(
        ticker=trade.ticker,
        quantity=trade.quantity,
        price=trade.price,
        date=trade.date,
    )
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade


@router.get("/trades", response_model=list[TradeOut])
def get_trades(db: Session = Depends(get_db)):
    return db.query(Trade).order_by(Trade.date.desc()).all()
