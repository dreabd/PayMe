from app.models import db,Card,environment, SCHEMA
from sqlalchemy.sql import text
from random import randint, choice

def seed_cards():
    card1 = Card(
        owner_id=randint(1,10),
        bank_name="VISA",
        card_number=4716557324235213,
    )
    card2 = Card(
        owner_id=randint(1,10),
        bank_name="VISA",
        card_number=4611732116871675,
    )
    card3 = Card(
        owner_id=randint(1,10),
        bank_name="MASTERCARD",
        card_number=5354974120858557,
    )
    card4 = Card(
        owner_id=randint(1,10),
        bank_name="MASTERCARD",
        card_number=5566513496375988,
    )
    card5 = Card(
        owner_id=randint(1,10),
        bank_name="AMEX",
        card_number=346865478562126,
    )
    card6 = Card(
        owner_id=randint(1,10),
        bank_name="AMEX",
        card_number=375290762317034,
    )
    card7 = Card(
        owner_id=randint(1,10),
        bank_name="DISCOVER",
        card_number=6011340895471351,
    )
    card8 = Card(
        owner_id=randint(1,10),
        bank_name="DISCOVER",
        card_number=6011038056797156,
    )

    card9 = Card(
        owner_id=6,
        bank_name="AMEX",
        card_number=341150227331734
    )

    card10 = Card(
        owner_id=1,
        bank_name = "MASTERCARD",
        card_number=5234145206075525,
    )

    card_list = [card1,card2,card3,card4,card5,card6,card7,card8,card9,card10]

    [db.session.add(card) for card in card_list]
    db.session.commit()

def undo_cards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cards"))

    db.session.commit()
