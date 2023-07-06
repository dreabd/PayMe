from flask import Blueprint, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db,User,Group,Membership
from sqlalchemy import insert,delete,or_

group_routes = Blueprint('groups', __name__)

@group_routes.route('/')
@login_required
def get_all_groups():
    '''
    User can see all the groups that have been created
    '''
    all_groups = Group.query.all()

    groups = [group.to_dict() for group in all_groups]

    return {"allGroups":groups}


