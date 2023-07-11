from app.models import db, Friend, environment, SCHEMA
from sqlalchemy.sql import text
from sqlalchemy import insert



def seed_friends():
    friends_seed = [
        {"userA_id": 1, "userB_id": 6},
        {"userA_id": 1, "userB_id": 7},
        {"userA_id": 1, "userB_id": 8},
        {"userA_id": 1, "userB_id": 9},
        {"userA_id": 1, "userB_id": 10},
        {"userA_id": 2, "userB_id": 1},
        {"userA_id": 2, "userB_id": 3},
        {"userA_id": 2, "userB_id": 5},
        {"userA_id": 3, "userB_id": 2},
        {"userA_id": 3, "userB_id": 4},
        {"userA_id": 3, "userB_id": 6},
        {"userA_id": 4, "userB_id": 1},
        {"userA_id": 4, "userB_id": 2},
        {"userA_id": 4, "userB_id": 3},
        {"userA_id": 4, "userB_id": 4},
        {"userA_id": 4, "userB_id": 5},
        {"userA_id": 4, "userB_id": 6},
        {"userA_id": 1, "userB_id": 3},
        {"userA_id": 1, "userB_id": 5},
        {"userA_id": 1, "userB_id": 13},
        {"userA_id": 1, "userB_id": 14},
        {"userA_id": 1, "userB_id": 15},
    ]

    for friend_data in friends_seed:
        userA_id = friend_data["userA_id"]
        userB_id = friend_data["userB_id"]

        friend = insert(Friend).values(userA_id=userA_id, userB_id=userB_id)

        db.session.execute(friend)
        db.session.commit()





# Uses a raw SQL query to TRUNCATE or DELETE the friends table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
