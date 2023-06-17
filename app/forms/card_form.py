from flask_wtf import FlaskForm
from wtforms import StringField,IntegerField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User

def card_validator(form,field):
    number = field.data
    bank_name = form.data["bank_name"]

    if bank_name == "AMEX":
        pass
    pass

class CardForm(FlaskForm):
    bank_name= StringField("Bank Name",validators=[DataRequired()])
    card_number= IntegerField("Card Number", validators=[DataRequired(),card_validator])
