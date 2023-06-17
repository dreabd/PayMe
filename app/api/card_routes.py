from flask import Blueprint, jsonify, session, request
from app.models import db, Card,Transaction
from flask_login import current_user, login_user, logout_user, login_required


card_routes = Blueprint("cards", __name__)

@card_routes.route("/user")
@login_required
def get_all_user_cards():
    '''
    Grabs all the cards associated with the user
    '''
    user_cards = Card.query.filter(Card.owner_id == current_user.id).all()
    res = [card.to_dict() for card in user_cards]

    return {"cards": res}
    