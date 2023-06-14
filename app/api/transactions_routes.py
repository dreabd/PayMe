from flask import Blueprint, jsonify, session, request
from app.models import Transaction, db
from ..forms.transaction import TransactionForm
from flask_login import current_user, login_user, logout_user, login_required


transactions_routes = Blueprint("transactions", __name__)


@transactions_routes.route("/user")
@login_required
def get_user_transactions():
    """
    Grab all the transactions that are associated with the current user
    """
    user_trans = Transaction.query.filter(
        (Transaction.payer_id == current_user.id)
        | (Transaction.requester_id == current_user.id)
    )

    user_transaction = [trans.to_dict() for trans in user_trans]

    return {"userTransaction": user_transaction}


@transactions_routes.route("/")
@login_required
def get_all_transaction():
    """
    Grabbing all the transactions that are public
    """

    all_trans = Transaction.query.filter(Transaction.public == True).all()
    print("I am the current user.........................", current_user.id)
    transactions = [trans.to_dict() for trans in all_trans]

    return {"transactions": transactions}


@transactions_routes.route("/", methods=["POST"])
@login_required
def post_transaction():
    """
    Grabs the information that the User sends and uses that information
    to post a new transaction
    """
    print("i am in the backend...............................")
    form = TransactionForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    print("I made it past the forms...........................")
    print("I am the form data...................",form.data)

    if form.validate_on_submit:
        data = form.data
        print("I am validated.................",data)
        new_transaction = Transaction(
            requester_id=current_user.id,
            payer_id=data["payer_id"],
            description=data["description"],
            public=data["public"],
            money=data["money"],
            category_id=data["category_id"],
        )
        print("I'm the new guy.....................",new_transaction.payer_id)
        db.session.add(new_transaction)
        db.session.commit()
        return (
            {"newTransaction": new_transaction.to_dict()},
            200,
            {"Content-Type": "application/json"},
        )
    if form.errors:
      print("There were some form errors", form.errors)
      return {"errors": form.errors}, 400, {"Content-Type": "application/json"}
