from flask_wtf import FlaskForm
from wtforms import IntegerField,BooleanField,TextAreaField
from wtforms.validators import DataRequired
from app.models import User
from app.models import Transaction, db

class TransactionForm(FlaskForm):
    payer_id = IntegerField("Payer Id", validators=[DataRequired()])
    description = TextAreaField("Description", validators=[DataRequired()])
    public = BooleanField("Public", validators=[DataRequired()])
    money = IntegerField("Money", validators=[DataRequired()])
    category_id = IntegerField("Category Id", validators=[DataRequired()])

class EditTransactionForm(FlaskForm):
    description = TextAreaField("Description", validators=[DataRequired()])
    public = BooleanField("Public", validators=[DataRequired()])
    money = IntegerField("Money", validators=[DataRequired()])
    category_id = IntegerField("Category Id", validators=[DataRequired()])
