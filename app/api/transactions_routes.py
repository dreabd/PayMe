from flask import Blueprint, jsonify, session, request
from app.models import Transaction,User, db
from ..forms.transaction import TransactionForm, EditTransactionForm
from flask_login import current_user, login_user, logout_user, login_required


transactions_routes = Blueprint("transactions", __name__)


@transactions_routes.route("/user")
@login_required
def get_user_transactions():
    """
    Grab all the transactions that are associated with the current user
    """

    print(current_user)
    user_trans = Transaction.query.filter(
        (Transaction.payer_id == current_user.id)
        | (Transaction.requester_id == current_user.id)
    ).filter(Transaction.completed == True)

    user_transaction = [trans.to_dict() for trans in user_trans]

    return {"transactions": user_transaction}


@transactions_routes.route("/user/incomplete")
@login_required
def get_incomplete_user_transactions():
    """
    Grab all the incompleted that are associated with the current user
    """

    print(current_user)
    user_trans = Transaction.query.filter(
        (Transaction.payer_id == current_user.id)
        | (Transaction.requester_id == current_user.id)
    ).filter(Transaction.completed == False)

    user_transaction = [trans.to_dict() for trans in user_trans]

    return {"transactions": user_transaction}


@transactions_routes.route("/")
@login_required
def get_all_transaction():
    """
    Grabbing all the transactions that are public and completed
    """

    all_trans = Transaction.query.filter(Transaction.public == True).filter(Transaction.completed == True).all()
    transactions = [trans.user_dict() for trans in all_trans]

    return {"transactions": transactions}


@transactions_routes.route("/", methods=["POST"])
@login_required
def post_transaction():
    """
    Grabs the information that the User sends and uses that information
    to post a new transaction
    """
    # print("i am in the backend...............................")
    form = TransactionForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    # print("I made it past the forms...........................")
    # print("I am the form data...................",form.data)

    if form.validate_on_submit:
        data = form.data
        # print("I am validated.................",data)
        new_transaction = Transaction(
            requester_id=data["requester_id"],
            payer_id=data["payer_id"],
            description=data["description"],
            public=data["public"],
            money=data["money"],
            category_id=data["category_id"],
        )
        # print("I'm the new guy.....................",new_transaction.payer_id)
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


@transactions_routes.route("/<int:id>", methods=["GET"])
@login_required
def get_single_transaction(id):
    """
    Grabs a specific transaction by it's id and returns that to the user
    """
    single_transaction = Transaction.query.get(id)

    if single_transaction is None:
        return {"errors": "Transaction not Found"}, 404

    response = single_transaction.to_dict()
    return {"transaction": response}

@transactions_routes.route("/<int:id>",methods=["PUT"])
@login_required
def put_single_transaction(id):
  '''
  Grabs a single project by it's id and then based of the user's inputs,
  adjusts the transaction given it passes through a multitude if constraints
  '''
  single_transaction = Transaction.query.get(id)
  form = EditTransactionForm()

  if(single_transaction.requester_id != current_user.id):
      return {"errors":"Can not edit another user's transaction request"},401

  if(form.validate_on_submit and not single_transaction.completed):
    print("transaction edit.................")
    data = form.data
    updated_transaction = single_transaction
    if data["description"]:
        updated_transaction.description = data["description"]
    if data["public"]:
        updated_transaction.public = data["public"]
    if data["money"]:
        updated_transaction.money = data["money"]
    if data["category_id"]:
        updated_transaction.category_id = data["category_id"]
    db.session.commit()
    return (
        {"transaction": updated_transaction.to_dict()},
        200,
        {"Content-Type": "application/json"},
    )
  if(single_transaction.completed):
      print("There were some errors")
      return {"errors": "User's can not edit a transaction that has been completed"}, 400, {"Content-Type": "application/json"}
  if form.errors:
      print("There were some form errors", form.errors)
      return {"errors": form.errors}, 400, {"Content-Type": "application/json"}

@transactions_routes.route("/<int:id>",methods=["DELETE"])
@login_required
def delete_single_transaction(id):
    '''
    Grabs a single transaction by it's id and deletes it
    '''
    single_transaction = Transaction.query.get(id)

    if(single_transaction.completed):
        print("There were some errors")
        return {"errors": "User's can not delete a transaction that has been completed"}, 400, {"Content-Type": "application/json"}

    if(single_transaction is None):
        return {"errors": "Transaction does not exist"},404

    if(current_user.id != single_transaction.requester_id):
        return {"errors":"Forbidden"},401

    db.session.delete(single_transaction)
    db.session.commit()
    return {"message": "Successfully Deleted"}
