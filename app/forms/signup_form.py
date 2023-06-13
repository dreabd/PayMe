from flask_wtf import FlaskForm
from wtforms import StringField,IntegerField
from wtforms.validators import DataRequired, Email, ValidationError,NumberRange
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

def phone_exists(form,field):
    number = field.data
    user = User.query.filter(User.phone_number == number).first()
    if user:
        raise ValidationError('Phone number is already in use.')

def phone_length(form,field):
    number = field.data
    if len(str(number)) != 10:
        raise ValidationError('Please provide a valid 10-digit phone number')



class SignUpForm(FlaskForm):
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    username = StringField(
        'Username', validators=[DataRequired(), username_exists])
    email = StringField('Email', validators=[DataRequired(), user_exists])
    phone_number = IntegerField(
        "Phone Number",
        validators=[
            DataRequired(),
            phone_exists,
            phone_length
            ]
        )

    password = StringField('password', validators=[DataRequired()])
