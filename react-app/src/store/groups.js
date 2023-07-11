import { normalizeObj } from './helpers';
import { getGroupTransactions } from './transactions';

//--------------------- Type Variables ---------------------
const GET_ALL_GROUPS = 'groups/getAllGroups'
const GET_SINGLE_GROUP = 'groups/getSingleGroup'
const GET_GROUP_MEMBERS = 'groups/getGroupMembers'


//--------------------- Action Creators --------------------
const getAllGroups  = (groups) =>{
    return{ 
        type: GET_ALL_GROUPS,
        groups
    }
}

const getSingleGroup = (group) =>{
    return{
        type: GET_SINGLE_GROUP,
        group
    }
}

const getGroupMembers = (members) =>{
    return{ 
        type: GET_GROUP_MEMBERS,
        members
    }
}

//------------------------- THUNK --------------------------
export const getAllGroupsThunk = () => async dispatch =>{
    const res = await fetch("/api/groups/")

    if(res.ok){
        const {groups} = await res.json()
        // console.l
        dispatch(getAllGroups(groups))
        return
    } else{
        console.log("Probelm Loading All Groups")
    }
}

export const getSingleGroupThunk = (id) => async dispatch =>{
    const res = await fetch(`/api/groups/${id}`)

    if (res.ok){
        const {group,transactions} = await res.json()
        dispatch(getSingleGroup(group))
        dispatch(getGroupMembers(group.members))
        transactions && dispatch(getGroupTransactions(transactions))
    } else{
        const {errors} = await res.json()
        return errors
    }

}

//--------------------- Initial State ----------------------
const initialState = {
    allGroups: {},
    groupMembers:{},
    singleGroup: {}
}
//------------------------ Reducer -------------------------
const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_GROUPS:
            return{...state,allGroups:{...normalizeObj(action.groups)}}
        case GET_SINGLE_GROUP:
            return{...state,singleGroup:{...action.group}}
        case GET_GROUP_MEMBERS:
            return{...state,groupMembers:{...normalizeObj(action.members)}}
        default:
            return state
    }
}

export default groupReducer