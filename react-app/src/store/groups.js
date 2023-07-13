import { normalizeObj } from './helpers';
import { getGroupTransactions } from './transactions';
import { deleteMyGroup } from './session';

//--------------------- Type Variables ---------------------
const GET_ALL_GROUPS = 'groups/getAllGroups'
const GET_SINGLE_GROUP = 'groups/getSingleGroup'
const GET_GROUP_MEMBERS = 'groups/getGroupMembers'

const POST_GROUP_MEMBER = "group/postGroupMember"
const POST_NEW_GROUP = "group/postNewGroup"

const PUT_GROUP = "group/putGroup"

const DELETE_GROUP_MEMBER = "group/deleteGroupMember"
const DELETE_GROUP = "group/deleteGroup"
//--------------------- Action Creators --------------------
const getAllGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups
    }
}

const getSingleGroup = (group) => {
    return {
        type: GET_SINGLE_GROUP,
        group
    }
}

const getGroupMembers = (members) => {
    return {
        type: GET_GROUP_MEMBERS,
        members
    }
}

export const postGroupMember = (member) => {
    return {
        type: POST_GROUP_MEMBER,
        member
    }
}

const postNewGroup = (group) => {
    return {
        type: POST_NEW_GROUP,
        group
    }
}

const putGroup = (group) => {
    return {
        type: PUT_GROUP,
        group
    }
}

const deleteGroupMember = (member_id) => {
    return {
        type: DELETE_GROUP_MEMBER,
        member_id
    }
}
const deleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId
    }
}

//------------------------- THUNK --------------------------
export const getAllGroupsThunk = () => async dispatch => {
    const res = await fetch("/api/groups/")

    if (res.ok) {
        const { groups } = await res.json()
        // console.l
        dispatch(getAllGroups(groups))
        return
    } else {
        console.log("Probelm Loading All Groups")
    }
}

export const getSingleGroupThunk = (id) => async dispatch => {
    const res = await fetch(`/api/groups/${id}`)

    if (res.ok) {
        const { group, transactions } = await res.json()
        dispatch(getSingleGroup(group))
        dispatch(getGroupMembers(group.members))
        transactions && dispatch(getGroupTransactions(transactions))
    } else {
        const { errors } = await res.json()
        return { errors }
    }

}

export const postNewGroupThunk = (groupData) => async dispatch => {
    const res = await fetch("/api/groups/", {
        method: "POST",
        body: groupData
    })

    if (res.ok) {
        const { newGroup } = await res.json()
        dispatch(postNewGroup(newGroup))
        return newGroup.id
    }
    else {
        const { errors } = await res.json()
        console.log(errors)
        return errors
    }
}

export const putGroupThunk = (groudId, groupData) => async dispatch => {
    const res = await fetch(`/api/groups/${groudId}`, {
        method: "PUT",
        body: groupData
    })

    if (res.ok) {
        const { group } = await res.json()
        dispatch(putGroup(group))
        return
    }
    else {
        const { errors } = await res.json()
        return errors
    }
}

export const deleteGroupMemberThunk = (id, user_id) => async dispatch => {
    console.log(user_id)
    const res = await fetch(`/api/groups/${id}/members`, {
        method: "DELETE",
    })

    if (res.ok) {
        dispatch(deleteGroupMember(user_id))
        return
    }
    else {
        const { errors } = await res.json()
        return errors
    }
}

export const deleteGroupThunk = (groupId) => async dispatch => {
    const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(deleteGroup(groupId))
        dispatch(deleteMyGroup(groupId))
        return
    } else {
        const { errors } = await res.json()
        return errors
    }
}

//--------------------- Initial State ----------------------
const initialState = {
    allGroups: {},
    groupMembers: {},
    singleGroup: null
}
//------------------------ Reducer -------------------------
const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_GROUPS:
            return { ...state, allGroups: { ...normalizeObj(action.groups) } }
        case GET_SINGLE_GROUP:
            return { ...state, singleGroup: { ...action.group } }
        case GET_GROUP_MEMBERS:
            return { ...state, groupMembers: { ...normalizeObj(action.members) } }

        case POST_NEW_GROUP:
            newState = { ...state }
            newState.allGroups[action.group.id] = action.group
            return newState
        case POST_GROUP_MEMBER:
            newState = { ...state }
            newState.groupMembers[action.member.id] = action.member
            return newState

        case PUT_GROUP:
            return { ...state, singleGroup: { ...action.group } }

        case DELETE_GROUP_MEMBER:
            newState = { ...state }
            delete newState.groupMembers[action.member_id]
            delete newState.singleGroup.members[action.member_id]
            return newState
        case DELETE_GROUP:
            newState = { ...state }
            delete newState.allGroups[action.groupId]
            return newState
        default:
            return state
    }
}

export default groupReducer
