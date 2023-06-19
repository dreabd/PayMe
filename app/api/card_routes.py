from flask import Blueprint, jsonify, session, request
from app.models import db, Card
from app.forms.card_form import CardForm
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
    res2 = [card.to_dict() for card in cards]
    return {"cards": res,"all_cards":res2}


@card_routes.route("/new",methods=["POST"])
@login_required
def post_new_card():
    '''
    Posts a new Cardnk
    - Grabs the information sent from the user
    - Passes that information through wtforms validators
    - If they are validated on submit then submits a new credit card for the currenkt user
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
        return {"newCard": new_card.to_dict()},200
    if form.errors:
        print("There were some form errors", form.errors)
        return {"errors": form.errors}, 400, {"Content-Type": "application/json"}



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

    db.session.delete(deleted_card)
    db.session.commit()

    return{"message":"Card Successfully deleted"}
