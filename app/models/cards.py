from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Card(db.Model):
    __tablename__ = "cards"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    bank_name = db.Column(db.String(),nullable=False)
    card_number = db.Column(db.Integer(),nullable=False)
    created_at = db.Column(db.Date, nullable=False, default=date.today())

    user = db.relationship("User",back_populates="card")


    def to_dict(self):
        return{
            "owner_id": self.owner_id,
            "bank_name": self.bank_name,
            "card_number":self.card_number,
        }
