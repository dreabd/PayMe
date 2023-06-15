import { normalizeObj } from "./helpers";


// constants
const SET_USER = "session/SET_USER";
const GET_USERS = "session/getAllUsers";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const getAllUsers=(users) =>{
	return{
		type:GET_USERS,
		users
	}
}


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

export const getAllUsersThunk = () => async dispatch =>{
	const res = await fetch("/api/users/")

	if(res.ok){
		const {users} = await res.json()
		dispatch(getAllUsers(users))
		return
	}
	else{
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

const initialState = { user: null,allUsers:{}};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return {...state,user: action.payload };
		case REMOVE_USER:
			return {...state,user: null };
		case GET_USERS:
			return {...state,allUsers:{...normalizeObj(action.users)}}
		default:
			return state;
	}
}
