from flask import Blueprint, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User,Transaction

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

    return user.to_dict()

@user_routes.route('/<int:id>/transactions')
@login_required
def get_user_transactions(id):
    '''
    Couple things going to happen in this query:
        - If it is the user, return all the COMPLETED transaction of the user
            - That will then use the frontend to determine the chart JS stuff
        - If it is the friend of the user
            - Return all PUBLIC COMPLETED transactions AND COMPLETED TRANSACTIONS between the user and their friend
        - If it is NOT a friend, return all PUBLIC COMPLETED TRANSACTIONS
    '''

    user = User.query.get(id)

    # Getting all the friends of the current user
    friends = [friend.id for friend in current_user.friends]
    if user is None:
        return {"error": "Could not find User"},404

    # print("I am in the backend.....................💻💻💻")
    if user.id == current_user.id:

        user_trans = (
        Transaction.query.filter(
            (Transaction.payer_id == current_user.id)
            | (Transaction.requester_id == current_user.id)
        )
        .filter(Transaction.completed == True)
        .order_by(Transaction.created_at.desc())
        )


        user_transaction = [trans.to_dict() for trans in user_trans]

        def transaction_obj(list1):
            return{
            "money_requested": sum([trans["money"] for trans in list1 if trans["requester_id"] == current_user.id]),
            "money_paid":  -sum([trans["money"] for trans in list1 if trans["payer_id"] == current_user.id ]),
            "money_total": sum([trans["money"] if trans["requester_id"] == current_user.id else -trans["money"] for trans in list1]),
            "trans_requested":[{"money":trans["money"],"date":trans["created_at"]} for trans in list1 if trans["requester_id"] == current_user.id],
            "trans_paid":[{"money":-trans["money"],"date":trans["created_at"]} for trans in list1 if trans["payer_id"] == current_user.id ],
            "list":list1
            }
        total_transaction_data = transaction_obj(user_transaction)
        total_transaction_data.pop("list")

        Housing = filter(lambda x:(x["category"]["id"] == 1),user_transaction)
        housing_list = list(Housing)
        Housing_Transactions = transaction_obj(housing_list)

        Transportation = filter(lambda x:(x["category"]["id"]==2),user_transaction)
        transportation_list = list(Transportation)
        Transportation_Transactions = transaction_obj(transportation_list)

        Food = filter(lambda x:(x["category"]["id"]==3),user_transaction)
        food_list = list(Food)
        Food_Transactions = transaction_obj(food_list)

        Personal = filter(lambda x:(x["category"]["id"]==4),user_transaction)
        personal_list = list(Personal)
        Personal_Transactions = transaction_obj(personal_list)


        Entertainment = filter(lambda x:(x["category"]["id"]==5),user_transaction)
        entertainment_list = list(Entertainment)
        Entertainment_Transactions = transaction_obj(entertainment_list)

        Saving = filter(lambda x:(x["category"]["id"]==6),user_transaction)
        saving_list = list(Saving)
        Saving_Transactions = transaction_obj(saving_list)

        return{
            "transactions": user_transaction,
            "allTransData":transaction_obj(user_transaction),
            "category":{
            "housing":Housing_Transactions,
            "transportion":Transportation_Transactions,
            "food":Food_Transactions,
            "personal":Personal_Transactions,
            "entertainment":Entertainment_Transactions,
            "saving":Saving_Transactions
            },
            }

    if user.id in friends:
        user_trans = (
        Transaction.query.filter(
            (Transaction.payer_id == user.id)
            | (Transaction.requester_id == user.id)
        )
        .filter(Transaction.completed == True)
        .filter(Transaction.public == True)
        .order_by(Transaction.created_at.desc())
        )

        user_transaction = [trans.to_dict() for trans in user_trans]

        # I want to return all the transactions between the user's id and the current user's id
        #
        # def filter_1(x):
        #     # print("something..................",x)
        #     # print("true or false......................", x["payer_id"] == current_user.id or x["requester_id"] == current_user.id)
        #     # print ("Requester",x["requester_id"],x["requester"]["first_name"])
        #     # print ("Payer",x["payer_id"], x["payer"]["first_name"])
        #     # print (current_user.id,current_user.first_name)
        #     # print(str(current_user.id or user.id))
        #     # print("........................................................................")
        #     return x["payer_id"] == current_user.id or x["requester_id"] == current_user.id

        friend_trans = filter(lambda x: (x["payer_id"] == current_user.id or x["requester_id"] == current_user.id), user_transaction)
        friend_transaction = list(friend_trans)

        print("friend_transaction..............................😀", friend_transaction )

        user = user.to_dict()
        del user["cards"]
        del user["balance"]
        del user["phone_number"]
        del user["email"]

        return{
            "user":user,
            "transactions": user_transaction,
            "friendTransactions": friend_transaction}
    else:
        user_trans = (
        Transaction.query.filter(
            (Transaction.payer_id == user.id)
            | (Transaction.requester_id == user.id)
        )
        .filter(Transaction.completed == True)
        .filter(Transaction.public == True)
        .order_by(Transaction.created_at.desc())
        )

        user_transaction = [trans.to_dict() for trans in user_trans]
        user = user.to_dict()
        del user["cards"]
        del user["balance"]
        del user["phone_number"]
        del user["email"]

        return{"user":user,"transactions": user_transaction}
