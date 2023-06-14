from app.models import db, Category, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_categories():
    cat_1 = Category(type="Housing ")
    cat_2 = Category(type="Transportation")
    cat_3 = Category(type="Food")
    cat_4 = Category(type="Personal")
    cat_5 = Category(type="Entertainment")
    cat_6 = Category(type="Saving")

    cat_list=[cat_1,cat_2,cat_3,cat_4,cat_5,cat_6,]

    [db.session.add(cat) for cat in cat_list]
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the categories table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_categories():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.categories RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM categories"))

    db.session.commit()
