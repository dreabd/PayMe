import { normalizeObj } from './helpers';

//--------------------- Type Variables ---------------------
const GET_ALL_GROUPS = 'groups/getAllGroups'


//--------------------- Action Creators --------------------
const getAllGroups  = (groups) =>{
    return{ 
        type: GET_ALL_GROUPS,
        groups
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

//--------------------- Initial State ----------------------
const initialState = {
    allGroups: {},
    singleGroup: {}
}
//------------------------ Reducer -------------------------
const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_GROUPS:
            return{...state,allGroups:{...normalizeObj(action.groups)}}
        default:
            return state
    }
}

export default groupReducer