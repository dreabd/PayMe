from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    # friends = user.friends
    # # [friend for friend in fr]
    # for friend in friends:
    #     friend = friend.to_dict()
    #     print("............................",friend)
    # res2 = [friend.to_dict() for friend in friends]
    # res = user.to_dict()
    # res["friends"] = res2
    # print(res2)
    # # print("stuff...........................................",friends)
    return user.to_dict()
