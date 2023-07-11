from app.models import db, Membership, environment, SCHEMA
from sqlalchemy.sql import text
from sqlalchemy import insert


def seed_memberships():
    memberships_seed=[
        {"user_id":1, "group_id":1},
        # {"user_id":2, "group_id":1},
        # {"user_id":3, "group_id":1},
        # {"user_id":4, "group_id":1},
        # {"user_id":5, "group_id":1},
        # {"user_id":6, "group_id":1},
        # {"user_id":7, "group_id":1},
        # {"user_id":8, "group_id":1},
        # {"user_id":9, "group_id":1},
        # {"user_id":10, "group_id":1},
        # {"user_id":11, "group_id":1},
        # {"user_id":12, "group_id":1},
        {"user_id":12, "group_id":2},
        {"user_id":10, "group_id":2},
        {"user_id":8, "group_id":2},
        {"user_id":6, "group_id":2},
        {"user_id":4, "group_id":2},
        {"user_id":2, "group_id":2},
        {"user_id":1, "group_id":3},
        {"user_id":3, "group_id":3},
        {"user_id":5, "group_id":3},
        {"user_id":7, "group_id":3},
        {"user_id":1, "group_id":4},
        {"user_id":2, "group_id":4},
        {"user_id":3, "group_id":4},
        {"user_id":4, "group_id":4},
        {"user_id":5, "group_id":4},
        {"user_id":13, "group_id":5},
        {"user_id":14, "group_id":5},
        {"user_id":15, "group_id":5},
        # {"user_id":13, "group_id":5},
    ]

    for membership_data in memberships_seed:
        user_id = membership_data["user_id"]
        group_id = membership_data["group_id"]

        membership = insert(Membership).values(user_id=user_id,group_id=group_id)

        db.session.execute(membership)
        db.session.commit()




# Uses a raw SQL query to TRUNCATE or DELETE the friends table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_memberships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.memberships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM memberships"))

    db.session.commit()
