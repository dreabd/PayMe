from flask import Blueprint, jsonify, session, request
from app.models import db, Card
from app.forms.card_form import CardForm,EditCardForm
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

    cards = Card.query.all()
    return {"cards": res}


@card_routes.route("/new",methods=["POST"])
@login_required
def post_new_card():
    '''
    Posts a new Card
    - Grabs the information sent from the user
    - Passes that information through wtforms validators
    - If they are validated on submit then submits a new credit card for the curret user
    - If there are any validation errors, then they will be sent back to the front end
    '''

    print("I am in the backend route............................")

    form = CardForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    print("I made it past the form this is the form info...............",form.data)
    print("form erorrs.......................",form.errors)
    if form.validate_on_submit():
        data = form.data
        print("I made it past the validations............................")
        new_card = Card(
            owner_id=current_user.id,
            bank_name=data["bank_name"],
            card_number=data["card_number"]
        )

        db.session.add(new_card)
        db.session.commit()
        return {"card": new_card.to_dict()},200
    if form.errors:
        print("There were some form errors", form.errors)
        return {"errors": form.errors}, 400, {"Content-Type": "application/json"}

@card_routes.route("/<int:id>")
@login_required
def get_single_card(id):
    single_card = Card.query.get(id)

    if single_card.owner_id != current_user.id:
        return {"error":"unauthorized"}
    if single_card is None:
        return {"error":"Card can not be found"}

    return {"card": single_card.to_dict()}

@card_routes.route("/<int:id>",methods=["PUT"])
@login_required
def update_card(id):
    '''
    User sends an ID to the backend
    Backend grabs that id and does some validation(Does the user own this card or is it validated card)
    If Updated Card Passes through all the validations then we will update that card.
    Otherwise the backend will send errors that the user will need to fix
    '''

    updated_card = Card.query.get(id)

    if updated_card.owner_id != current_user.id:
        return {"errors": "Unauthorized"},401

    if updated_card is None:
        return {"errors": "Card Could not be found"},404

    form = EditCardForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        data = form.data
        if data["card_number"]:
            updated_card.card_number = data["card_number"]
        if data["bank_name"]:
            updated_card.bank_name = data["bank_name"]

        db.session.commit()
        return {"card": updated_card.to_dict()}
    if form.errors:
        print("There were some errors")
        return{"errors":form.errors},400,


    pass

@card_routes.route("/<int:id>",methods=["DELETE"])
@login_required
def delete_card(id):
    '''
    Grabs a card by its id from whatever the user inputs.
    Validators to assure that the user owns that card.
    If all is good, then the card is going to be deleted.
    '''

    deleted_card = Card.query.get(id)

    if(current_user.id != deleted_card.owner_id):
        return {"errors": "unauthorized"},400

    if deleted_card is None:
        return {"errors": "Card could not be found"},404

    db.session.delete(deleted_card)
    db.session.commit()

    return{"message":"Card Successfully deleted"}
