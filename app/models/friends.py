from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

Friend = db.Table(
    "friends",
    db.Column(
        'userA_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True
    ),
    db.Column(
        'userB_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True
    ),
    # Can Not Friend Yourself
    db.UniqueConstraint("userA_id", "userB_id"),
)

if environment == "production":
    Friend.schema = SCHEMA
