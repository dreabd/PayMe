from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

Membership = db.Table(
    "memberships",
    db.Column(
        'user_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True
    ),
    db.Column(
        'group_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("groups.id")),
        primary_key=True
    ),
    # Can Not be part of the same group twice
    db.UniqueConstraint("user_id", "group_id"),
)

if environment == "production":
    Membership.schema = SCHEMA
