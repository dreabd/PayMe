from flask_wtf import FlaskForm
from wtforms import IntegerField,BooleanField,TextAreaField,StringField
from wtforms.validators import DataRequired, Email, ValidationError,NumberRange
from app.models import Group, db

def group_exists(form, field):
    # Checking if username is already in use
    name = field.data
    group = Group.query.filter(Group.name == name).first()
    if group:
        raise ValidationError('Group name is already in use.')
    
class GroupForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(),group_exists])
    isPublic = BooleanField("Public",default=False)

