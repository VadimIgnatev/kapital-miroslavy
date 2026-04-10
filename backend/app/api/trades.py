from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.trade import Trade

router = APIRouter()

ADMIN_ID = 267870421

# Разрешённые тикеры (жёстко заданы)
ALLOWED_TICKERS = [
    # exporters
    "NVTK", "GMKN", "PLZL", "PHOR", "CHMF", "NLMK",
    # dividend
    "LKOH", "SIBN", "MTSS", "SBER",
    # crypto
    "BTC", "ETH",
]


# ── Pydantic schemas ───────────────────────────────────────────

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


class TradeUpdate(BaseModel):
    quantity: Optional[float] = None
    price: Optional[float] = None
    date: Optional[date] = None


class TradeOut(BaseModel):
    id: int
    ticker: str
    quantity: float
    price: float
    date: date

    model_config = {"from_attributes": True}


# ── Auth helper ────────────────────────────────────────────────

def _require_admin(request: Request) -> None:
    raw = request.headers.get("X-Telegram-User-Id", "")
    try:
        caller_id = int(raw)
    except ValueError:
        raise HTTPException(status_code=403, detail="Forbidden")
    if caller_id != ADMIN_ID:
        raise HTTPException(status_code=403, detail="Forbidden")


# ── Endpoints ─────────────────────────────────────────────────

@router.post("/trades", response_model=TradeOut)
def create_trade(trade: TradeCreate, request: Request, db: Session = Depends(get_db)):
    _require_admin(request)
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


@router.get("/trades/{trade_id}", response_model=TradeOut)
def get_trade(trade_id: int, db: Session = Depends(get_db)):
    db_trade = db.get(Trade, trade_id)
    if not db_trade:
        raise HTTPException(status_code=404, detail="Сделка не найдена")
    return db_trade


@router.patch("/trades/{trade_id}", response_model=TradeOut)
def update_trade(
    trade_id: int,
    update: TradeUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    _require_admin(request)
    db_trade = db.get(Trade, trade_id)
    if not db_trade:
        raise HTTPException(status_code=404, detail="Сделка не найдена")
    if update.quantity is not None:
        db_trade.quantity = update.quantity
    if update.price is not None:
        db_trade.price = update.price
    if update.date is not None:
        db_trade.date = update.date
    db.commit()
    db.refresh(db_trade)
    return db_trade


@router.delete("/trades/{trade_id}", status_code=204)
def delete_trade(trade_id: int, request: Request, db: Session = Depends(get_db)):
    _require_admin(request)
    db_trade = db.get(Trade, trade_id)
    if not db_trade:
        raise HTTPException(status_code=404, detail="Сделка не найдена")
    db.delete(db_trade)
    db.commit()
