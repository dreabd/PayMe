from .db import db, environment, SCHEMA, add_prefix_for_prod
from .memberships import Membership
from .user import User
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

    group_memberships = db.relationship(
        "User",
        secondary=Membership,
        back_populates="user_memberships",
        cascade="all, delete",
    )

    def to_dict(self):
        return{
            "owner_id": User.query.get(self.owner_id).trans_dict(),
            "name": self.name,
            "created_at": self.created_at,
            # 'members': [user.friend_dict() for user in self.group_memberships],
            'memberCount':len(self.group_memberships)
        }
    
    def one_dict(self):
        return{
            "owner_id": User.query.get(self.owner_id).trans_dict(),
            "name": self.name,
            "created_at": self.created_at,
            'members': [user.friend_dict() for user in self.group_memberships],
            'memberCount':len(self.group_memberships)
        }
