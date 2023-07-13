import { normalizeObj } from "./helpers";


// constants
const SET_USER = "session/SET_USER";
const GET_USERS = "session/getAllUsers";
const GET_OTHER_USERS = "session/getOtherUsers"
const REMOVE_USER = "session/REMOVE_USER";
const DELETE_MY_GROUP = "session/deleteMyGroup"
// const PUT_MY_GROUP = "session/putMyGroup"

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const getAllUsers = (users) => {
	return {
		type: GET_USERS,
		users
	}
}

export const deleteMyGroup = (groupId) => {
	return {
		type: DELETE_MY_GROUP,
		groupId
	}
}

export const getOtherUsers = (user) => {
	return {
		type: GET_OTHER_USERS,
		user
	}
}

// export const putMyGroup = (group) => {
// 	return {
// 		type: PUT_MY_GROUP,
// 		group
// 	}
// }


export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const getAllUsersThunk = () => async dispatch => {
	const res = await fetch("/api/users/")

	if (res.ok) {
		const { users } = await res.json()
		dispatch(getAllUsers(users))
		return
	}
	else {
		console.log("There were some errors")
	}
}

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (signUpInfo) => async (dispatch) => {
	// console.log("response.................. okay?",)
	// console.log("Signupinfo.........................",signUpInfo)
	// for (let key of signUpInfo.entries()) {
	// 	console.log("Thunk",key[0] + ' ----> ' + key[1])
	// }
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		body: signUpInfo
	});

	if (response.ok) {
		console.log('response ok..................!!!!!!!!!!!')
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

const initialState = { user: null, allUsers: {}, otherUser: {} };

export default function reducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case SET_USER:
			return { ...state, user: action.payload };
		case REMOVE_USER:
			return { ...state, user: null };
		case GET_USERS:
			return { ...state, allUsers: { ...normalizeObj(action.users) } }
		case GET_OTHER_USERS:
			return { ...state, otherUser: action.user }

			return {...state,user:{...state.user}}
		case DELETE_MY_GROUP:
			newState = { ...state }
			const groupFilter = newState.user.my_groups.filter(group => {
				// console.log("group.........................",group.id)
				// console.log("group.........................",action.groupId)
				// console.log("group.........................",group.id !== action.groupId)
				return group.id !== action.groupId
			})
			// console.log("😀.....................",groupFilter)
			newState.user.my_groups = groupFilter
			return newState
		default:
			return state;
	}
}
