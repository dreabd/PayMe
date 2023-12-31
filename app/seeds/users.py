from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    # Group of payers
    user1 = User(
        username="Demo",
        first_name="Demo",
        last_name="User",
        balance=10000,
        phone_number=1111111111,
        email="demo@aa.io",
        password="password",
    )
    user2 = User(
        username="marnie",
        first_name="Marnie",
        last_name="Smith",
        balance=1430,
        phone_number=1111111112,
        email="marnie@aa.io",
        password="password",
    )
    user3 = User(
        username="winny",
        first_name="Winfred",
        last_name="Hayden",
        balance=100,
        phone_number=1111111114,
        email="winfred@yahoo.com",
        password="password",
    )
    user4 = User(
        username="candy",
        first_name="Candace",
        last_name="Mcintyre",
        balance=1413,
        phone_number=1111111115,
        email="candy@email.com",
        password="password",
    )
    user5 = User(
        username="Ely",
        first_name="Elma",
        last_name="Garrison",
        balance=1022,
        phone_number=1111111116,
        email="ely@email.com",
        password="password",
    )
    # Group of Requesters
    user6 = User(
        username="jorge123",
        first_name="Jorge",
        last_name="Carlson",
        balance=12,
        phone_number=1111111117,
        email="jorge@email.com",
        password="password",
    )
    user7 = User(
        username="ejhoward",
        first_name="Elton",
        last_name="Howard",
        balance=122,
        phone_number=1111111118,
        email="ej@email.com",
        password="password",
    )
    user8 = User(
        username="chasethebank",
        first_name="Henry",
        last_name="Chase",
        balance=0,
        phone_number=1111111119,
        email="chase@email.org",
        password="password",
    )
    user9 = User(
        username="farmerboy",
        first_name="Alfonzo",
        last_name="Farmer",
        balance=4,
        phone_number=1111111120,
        email="farmerboy@gmail.com",
        password="password",
    )
    user10 = User(
        username="weberdict",
        first_name="Alana",
        last_name="Weber",
        balance=20,
        phone_number=1111111121,
        email="weber@email.com",
        password="password",
    )
    # No friends
    user11 = User(
        username="hold_on",
        first_name="Maxwell",
        last_name="Holden",
        balance=0,
        phone_number=1111111122,
        email="wholden@email.com",
        password="password",
    )
    user12 = User(
        username="RoseSmiles",
        first_name="Rosella",
        last_name="Miles",
        balance=10,
        phone_number=1111111123,
        email="rm@email.com",
        password="password",
    )
    user13 = User(
        username="lasfister",
        first_name="Latisha",
        last_name="Fischer",
        balance=20,
        phone_number=1111111124,
        email="fischtme@email.com",
        password="password",
    )
    user14 = User(
        username="elly",
        first_name="Elden",
        last_name="Buchanan",
        balance=45,
        phone_number=1111111125,
        email="elly@email.com",
        password="password",
    )
    user15 = User(
        username="SpamThis",
        first_name="Pam",
        last_name="Mathis",
        balance=59,
        phone_number=1111111126,
        email="sapm.this@email.com",
        password="password",
    )

    user_list = [
        user1,
        user2,
        user3,
        user4,
        user5,
        user6,
        user7,
        user8,
        user9,
        user10,
        user11,
        user12,
        user13,
        user14,
        user15
    ]


    [db.session.add(user) for user in user_list]
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
