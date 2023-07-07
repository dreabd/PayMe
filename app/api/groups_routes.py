from flask import Blueprint, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db,User,Group,Membership
from sqlalchemy import insert,delete,or_

group_routes = Blueprint('groups', __name__)

@group_routes.route('/')
@login_required
def get_all_groups():
    '''
    User can see all the groups that are public.
    '''
    all_groups = Group.query.filter(Group.isPublic).all()

    groups = [group.one_dict() for group in all_groups]

    return {"groups":groups}

@group_routes.route('/<int:id>')
@login_required
def get_single_group(id):
    '''
    User can checkout a single group and their members IF they are public
    '''
    
    one_group = Group.query.get(id)

    if one_group is None:
        return {"errors": "Group not Found"}, 404
    
    if not one_group.isPublic and current_user.id != one_group.owner_id:
        return {"errors": "Group not Public"}, 404

    respone = one_group.to_dict()
    return{"group":respone}

