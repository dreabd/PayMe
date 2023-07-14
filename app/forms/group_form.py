from flask_wtf import FlaskForm
from wtforms import IntegerField,BooleanField,StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import Group
from flask_login import current_user


def group_exists(form, field):
    # Checking if username is already in use
    name = field.data
    group = Group.query.filter(Group.name == name).first()
    if group:
        raise ValidationError('Group name is already in use.')
    
class GroupForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(),group_exists])
    isPublic = BooleanField("Public",default=False)
    owner_id = IntegerField("Owner ID",validators=[DataRequired()])


class GroupEditForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    isPublic = BooleanField("Public",default=False)
    owner_id = IntegerField("Owner ID",validators=[DataRequired()])

 