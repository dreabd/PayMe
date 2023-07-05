from .db import db, environment, SCHEMA, add_prefix_for_prod
from .memberships import Membership
from datetime import datetime
from sqlalchemy import or_


class Group(db.Model):
    __tablename__ = "groups"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    name = db.Column(db.String(55), nullable=False)

    memberships = db.relationship(
        "Group",
        secondary="memberships",
        primaryjoin=or_(Membership.c.user_id == id, Membership.c.group_id == id),
        secondaryjoin=or_(Membership.c.user_id == id, Membership.c.group_id == id),
        back_populates="memberships",
        cascade="all, delete",
    )
