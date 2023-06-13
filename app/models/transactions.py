from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date


class Transaction(db.Model):
    __tablename__ = "transactions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    payer_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    description = db.Column(db.Text, nullable=False)
    public = db.Column(db.Boolean, nullable=False)
    money = db.Column(db.Integer, nullable=False)
    completed = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.Date, nullable=False, default=date.today())
    category_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("categories.id")), nullable=False
    )

    requester  = db.relationship("users", backref="transaction",foreign_keys=[requester_id])
    payer = db.relationship("users", backref="transaction",foreign_keys=[payer_id])
    category = db.relationship("Category", back_populates="transaction")

    def to_dict(self):
        return{
            "requester_id": self.requester_id,
            "payer_id": self.payer_id,
            "description": self.description,
            "public": self.public,
            "money": self.money,
            "completed": self.completed,
            "created_at": self.created_at,
            "category": self.category.to_dict().type,
        }
