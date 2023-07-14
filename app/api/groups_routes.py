from flask import Blueprint,request
from flask_login import current_user, login_required
from app.models import db,Group,Membership,Transaction,User
from sqlalchemy import insert
from ..forms.group_form import GroupForm,GroupEditForm
from sqlalchemy import insert,delete,or_


group_routes = Blueprint('groups', __name__)

# -------- GET ALL GROUPS ROUTE --------
@group_routes.route('/')
@login_required
def get_all_groups():
    '''
    User can see all the groups that are public.
    '''
    all_groups = Group.query.filter(Group.isPublic).all()

    groups = [group.one_dict() for group in all_groups]

    return {"groups":groups}

# -------- POST GROUP ROUTE --------
@group_routes.route("/",methods=["POST"])
@login_required
def post_new_group():
    '''
    Grabs what the user inputs in the new group field:
        - Group Name
        - Owner ID
        - isPublic
    Based off those fields will then post the new group AND add the owner's id as the first member of that group

    '''

    form  = GroupForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    print(form.data)

    if form.validate_on_submit():
        data = form.data

        new_group = Group(
            owner_id = data["owner_id"],
            name=data["name"],
            isPublic=data["isPublic"]
        )
        db.session.add(new_group)
        db.session.commit()

        print(new_group.id)

        membership = insert(Membership).values(user_id=current_user.id, group_id=new_group.id)

        print(new_group.to_dict())
        db.session.execute(membership)
        db.session.commit()

        return {"newGroup":new_group.to_dict()},200



    if form.errors:
        print("There were some form errors", form.errors)
        return {"errors": form.errors}, 400, {"Content-Type": "application/json"}

# -------- GET SINGLE GROUP ROUTE --------
@group_routes.route('/<int:id>')
@login_required
def get_single_group(id):
    '''
    User can checkout a single group and their members IF they are public,
    Here are a couple things that would happen:
    - If the perosn is part of the group then:
        - Able to see members
        - Able to see transactions between members
    - Person is not part of group and group is public
        - Able to see members
    - Person is not part of group and group not is public
        - Will See Nothing
    '''

    one_group = Group.query.get(id)

    if one_group is None:
        return {"errors": "Group not Found"}, 404

    respone = one_group.to_dict()

    members_id = [member["id"] for member in respone["members"]]

    # Checks if the grup is public and if the current user is in the group
    if current_user.id not in members_id and not one_group.isPublic:
        return{"errors":"Unauthorized"},400


    if current_user.id not in members_id and one_group.isPublic:
        return{"group":respone}

    if current_user.id in members_id:
        # [1,2,3,4,5]
        #  ^ ^----->
        # [1,2,3,4,5]
        #    ^ ^--->
        # [1,2,3,4,5]
        #      ^ ^->
        l,r = 0,1

        transactions = []

        while l < len(members_id):
            while r < len(members_id):
                curr_mem = members_id[l]
                next_mem = members_id[r]

                curr_mem_transaction = (Transaction.query
                .filter(
                    (Transaction.payer_id == curr_mem)
                    | (Transaction.requester_id == curr_mem)
                )
                .filter(Transaction.completed == True)
                .filter(Transaction.public == True)
                .all()
                )

                member_trans = [trans.to_dict() for trans in curr_mem_transaction]

                group_trans = filter(lambda x: (x["payer_id"] == next_mem or x["requester_id"] == next_mem), member_trans)

                transactions = [*transactions,*group_trans]

                r+=1
            l+=1
            r = l+1


        return{"group":respone,"transactions":transactions}


# -------- POST MEMBERSHIP ROUTE --------
@group_routes.route("/<int:id>",methods=["POST"])
@login_required
def post_new_membership(id):
    '''
    Only the owner of a group could add people to the group
    Things I would need to grab:
        - Current user
        - Group ID
        - Person to Add ID
    '''

    # For Grabbing the Person's ID
    data = request.get_json()

    user = User.query.get(data["user_id"])

    group = Group.query.get(id)

    if group is None:
        return {"errors":"Group Not Found"},404

    if user is None:
        return {"errors":"User not found"},404


    if current_user.id != group.owner_id:
        return {"errors":"Unauthorized, Only the owner could add new members to the group"},401

    members_id = [member["id"] for member in group.to_dict()["members"]]

    if user.id in members_id:
        return {"errors":"User already added"},401

    friend_id = [friends["id"]for friends in current_user.to_dict()["friends"]]

    if user.id not in friend_id:
        return {"errors":"Unauthorized, Owner must be friends with all prospective members"},401

    membership = insert(Membership).values(user_id=user.id, group_id=group.id)
    db.session.execute(membership)
    db.session.commit()

    return {"message":"Sucessfully Added","newMember":user.to_dict()},200


# -------- DELETE MEMBERSHIP ROUTE --------
@group_routes.route("/<int:id>/members", methods=["DELETE"])
@login_required
def delete_member(id):
    '''
    Anyone could leave the group but OWNER CAN NOT REMOVE THEMSELVES FROM THE GROUP ( Would need to transfer ownership)
    When current user wants to leave a group:
        - Get the current user's id
        - Check if they are the owner or if they are a part of the group
        - will be removed from the group
    '''

    group = Group.query.get(id)

    if group is None:
        return {"errors": "Group Not Found"},404

    if group.owner_id == current_user.id:
        return {"errors":"Unauthorized, Need to transfer ownership before leaving"},401

    members_id = [members["id"]for members in group.to_dict()["members"]]

    if current_user.id not in members_id:
        return {"errors": "User Not Found in Group"},404

    delete_query = delete(Membership).where(
    ((Membership.c.user_id == current_user.id) & (Membership.c.group_id == group.id)))

    db.session.execute(delete_query)

    db.session.commit()

    return {"message": "Succesfully Deleted"},200


# -------- PUT GROUP ROUTE --------
@group_routes.route('/<int:id>',methods=["PUT"])
@login_required
def put_group(id):
    '''
    ONLY THE OWNER CAN EDIT THE NAME / ISPUBLIC OF THE GROUP
    if the user is the owner then the group will be adjust accordingly
    '''

    updated_group = Group.query.get(id)

    if updated_group is None:
        return {"errors": "Group does not exist"},404

    if updated_group.owner_id != current_user.id:
        return {"errors":"Unauthorized"},400

    form = GroupEditForm()
    form["csrf_token"].data = request.cookies["csrf_token"]


    if form.validate_on_submit():
        data = form.data

        if data["name"]:
            group_exists = Group.query.filter(Group.name == data["name"]).first()
            # print("🐀..........................",str(group_exists.name))
            # print("🐀..........................",str(updated_group.name))
            # print("🐀..........................",data["name"])
            # print("🐀..........................",str(group_exists.name) == data["name"])
            if group_exists and str(updated_group.name) != data["name"]:
                return {"errors":"Group name already in use."},400
            updated_group.name = data["name"]
        if data["isPublic"] in [True,False]:
            updated_group.isPublic = data["isPublic"]
        if data["owner_id"]:
            updated_group.owner_id = data["owner_id"]


        db.session.commit()
        return{"group": updated_group.to_dict()}

    if form.errors:
        print("There were some errors")
        return{"errors":form.errors},400,

# -------- DELETE GROUP ROUTE --------
@group_routes.route('/<int:id>',methods=["DELETE"])
@login_required
def delete_group(id):
    '''
    ONLY THE OWNER CAN DELETE A GROUP
    If the user is the owner then the group will be deleted
    '''

    group = Group.query.get(id)

    print(group)

    if group is None:
        return {"errors": "Group does not exist"},404

    if group.owner_id != current_user.id:
        return {"errors":"Unauthorized"},400

    db.session.delete(group)
    db.session.commit()

    return {"message": "Successfully Deleted"}
