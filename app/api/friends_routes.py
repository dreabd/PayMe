from flask import Blueprint, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from app.models import db,User,Transaction,Friend
from sqlalchemy import insert,delete,or_

friend_routes = Blueprint('friends', __name__)

# -------- POST ROUTE --------
@friend_routes.route("/<int:id>",methods=["POST"])
@login_required
def post_new_friend(id):
    '''
    When the current user encounters some that is not their friend this will:
        - Grab the id of the user that they want "friend"
        - add that friend into the the Friend Db
    '''

    new_friend = User.query.get(id)

    friends = [friend.id for friend in current_user.friends]

    if new_friend.id in friends:
        return {"error": "User is already a friend"},400

    if new_friend is None:
        return{"error": "User not found"},404
    
    if new_friend.id == current_user.id:
        return{"error": "Users can not be their own friend"},400
    

    # Simliar logic to the friendship seeds need to utlize SQL insert 
    friend = insert(Friend).values(userA_id=current_user.id, userB_id=new_friend.id)

    db.session.execute(friend)
    db.session.commit()

    return {"res":new_friend.friend_dict()}

# -------- DELETE ROUTE --------
@friend_routes.route("/<int:id>",methods=["DELETE"])
@login_required
def delete_user_friend(id):
    '''
    When the current user wants to "un-friend" someone this will:
        - Gather the id of the user from the current user
        - Determine if that user is a friend of the current user
        - If that is the case the friend will then be removed form the current user's friends
    '''

    user_friend = User.query.get(id)

    friends = [friend.id for friend in current_user.friends]

    if user_friend.id == current_user.id:
        return {"error": "User can not unfreind themselves."},400
    
    if user_friend is None: 
        return {"error": "User not found"},404
    
    if user_friend.id not in friends:
        return {"error": "User is not a friend"},400
    
    ''' 
    Creates a query that looks in the Friend join table that looks for a coulmn where:
        - userA_id is equal to the current user's id or user friend's id
        - userB_id is equal to the user's id or current user's id
    '''
    delete_query = delete(Friend).where(
    ((Friend.c.userA_id == current_user.id) & (Friend.c.userB_id == user_friend.id)) |
    ((Friend.c.userA_id == user_friend.id) & (Friend.c.userB_id == current_user.id)))

    db.session.execute(delete_query)

    db.session.commit()

    return {"message": "Succesfully Deleted"}
    
