from flask_wtf import FlaskForm
from app.models import Card, User
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError
from flask_login import current_user


def valid_banks(form, field):
    bank_name = field.data
    valid_banks = ["AMEX", "VISA", "MASTERCARD", "DISCOVER"]

    if bank_name not in valid_banks:
        raise ValidationError("Please try another card.")


def card_exists(form, field):
    new_card = field.data
    card = Card.query.filter(Card.owner_id == current_user.id).filter(
        Card.card_number == new_card
    ).first()

    if card:
        raise ValidationError("Card already added")


def card_validator(form, field):
    card_number = field.data
    bank_name = form.data["bank_name"]

    print("length of card................", bank_name)
    print("Card first digit................", str(card_number)[0])
    print(
        "Master card validator.................",
        str(card_number)[0] == 2 or str(card_number) == 5,
    )
    if len(str(card_number)) != 15 and len(str(card_number)) != 16:
        raise ValidationError("Card number invalid")
    if bank_name == "AMEX" and str(card_number)[0] != str(3):
        raise ValidationError("AMEX card number invalid")
    if bank_name == "MASTERCARD" and (str(card_number)[0] != str(2) or str(card_number)[0]!= str(5)):
            raise ValidationError("MASTERCARD card number invalid")
    if bank_name == "DISCOVER" and str(card_number)[0] != 6:
        raise ValidationError("DISCOVER card number invalid")
    if bank_name == "VISA" and str(card_number)[0] != str(4):
        raise ValidationError("VISA card number invalid")


class CardForm(FlaskForm):
    bank_name = StringField("Bank Name", validators=[DataRequired(), valid_banks])
    card_number = IntegerField(
        "Card Number", validators=[DataRequired(), card_validator, card_exists]
    )
