from flask import Blueprint, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User,Transaction,Friend

friend_routes = Blueprint('friends', __name__)

@friend_routes("/<int:id>",methods=["POST"])
@login_required
def post_new_friend(id):
    '''
    When the current user encounters some that is not their friend this will:
        - Grab the id of the user that they want "friend"
        - add that friend into the the Friend Db
        - 
    '''