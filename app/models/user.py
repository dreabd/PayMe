from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .friends import Friend
from .memberships import Membership
from sqlalchemy import or_


class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(), nullable=False, unique=False)
    last_name = db.Column(db.String(), nullable=False, unique=False)
    balance = db.Column(db.Integer(), nullable=False, default=0)
    phone_number = db.Column(db.Numeric(10), nullable=False, unique=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    card = db.relationship("Card", back_populates="user")
    friends = db.relationship(
        "User",
        secondary="friends",
        primaryjoin=or_(Friend.c.userA_id == id, Friend.c.userB_id == id),
        secondaryjoin=or_(Friend.c.userA_id == id, Friend.c.userB_id == id),
        back_populates="friends",
        cascade="all, delete",
    )

    user_memberships = db.relationship(
        "Group",
        secondary=Membership,
        back_populates="group_memberships"
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "balance": self.balance,
            "phone_number": self.phone_number,
            "username": self.username,
            "email": self.email,
            "cards": [card.to_dict() for card in self.card],
            'friends':[friend.friend_dict() for friend in self.friends if self.id != friend.id]
        }

    def trans_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
        }

    def friend_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
        }
