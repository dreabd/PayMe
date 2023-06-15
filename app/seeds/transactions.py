from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text
from random import randint, choice
from datetime import date

descpt = [
    "Food",
    "Drinks",
    "For Fun",
    "Shopppinggg",
    "Treat yourself to some starbies",
    "KBBQ",
    "Burgers",
    "Mom's Spaghetti",
    "Paying off the loan shark",
    "Cheers to a new year",
    "Amazonnnn",
    "tolls",
    "lol pay me back pleaseeee",
    "Gas",
    "birthday",
    "Concert ticketsss",
]


def seed_transactions():
    trans_list=[]
    for i in range(0, 100):
        trans = Transaction(
            requester_id=choice([6, 7, 8, 9, 10]),
            payer_id=choice([1, 2, 3, 4, 5]),
            description=choice(descpt),
            public=True,
            money=randint(5,50),
            completed=choice([True,False]),
            created_at = date(choice([2023, 2022]), randint(1,6), randint(1, 28)),
            category_id=choice([1,2,3,4,5,6]),
        )
        trans_list.append(trans)

    [db.session.add(trans)for trans in trans_list]
    db.session.commit()


def undo_transactions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM transactions"))

    db.session.commit()
