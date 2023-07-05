from app.models import db, Group, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime



def seed_groups():
    group_1  = Group(
        owner_id = 1,
        name = "Best Group",
    )

    group_list = [group_1]
    [db.session.add(group) for group in group_list]
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the groups table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM groups"))

    db.session.commit()
