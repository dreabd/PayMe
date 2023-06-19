import { normalizeObj } from './helpers';

//--------------------- Type Variables ---------------------
const GET_USER_CARDS = "cards/getUserCards"
const GET_SINGLE_CARD = "cards/getSingleCard"
const POST_NEW_CARD = "cards/postNewCard"
const PUT_CARD = "card/putCard"
const DELETE_CARD = "cards/deleteCard"

//--------------------- Action Creators --------------------
const getUserCards = (cards) => {
    return {
        type: GET_USER_CARDS,
        cards
    }
}
const getSingleCard = (card) => {
    return {
        type: GET_SINGLE_CARD,
        card
    }
}

const postNewCard = (card) => {
    return {
        type: POST_NEW_CARD,
        card
    }
}

const putCard = (card) => {
    return {
        type: PUT_CARD,
        card
    }
}

const deleteCard = (cardId) => {
    return {
        type: DELETE_CARD,
        cardId
    }
}
//------------------------- THUNK --------------------------
export const getUserCardsThunk = () => async dispatch => {
    const res = await fetch("/api/cards/user")

    if (res.ok) {
        const { cards } = await res.json()
        dispatch(getUserCards(cards))
        return
    }
    else {
        console.log("Problem loading user cards")
    }
}

export const getSingleCardThunk = (cardId) => async dispatch => {
    const res = await fetch(`/api/cards/${cardId}`)

    if (res.ok) {
        const { card } = await res.json()
        dispatch(getSingleCard(card))
        return
    } else {
        console.log("Some errors have occureddd...................")
        const { error } = await res.json()
        return error
    }
}

export const postNewCardThunk = (newCard) => async dispatch => {
    const res = await fetch('/api/cards/new', {
        method: "POST",
        body: newCard
    })

    if (res.ok) {
        const { card } = await res.json()
        dispatch(postNewCard(card))
        return
    } else {
        const { errors } = await res.json()
        console.log("Some Errors have occured.........")
        return errors
    }
}

export const putCardThunk = (cardId,updatedCard) => async dispatch => {
    console.log()
    const res = await fetch(`/api/cards/${cardId}`, {
        method: "PUT",
        body: updatedCard
    })

    if (res.ok) {
        const { card } = await res.json()
        dispatch(putCard(card))
        return
    }else{
        const {errors} = await res.json()
        return errors
    }
}

export const deleteCardThunk = (cardId) => async dispatch => {
    const res = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(deleteCard(cardId))
        return
    } else {
        const { errors } = await res.json()
        return errors
    }
}

//--------------------- Initial State ----------------------
const initialState = { userCards: {}, singleCard: {} }

//------------------------ Reducer -------------------------
const cardReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_USER_CARDS:
            return { ...state, userCards: { ...normalizeObj(action.cards) } }
        case GET_SINGLE_CARD:
            return { ...state, singleCard: { ...action.card } }
        case POST_NEW_CARD:
            newState = { ...state }
            newState.userCards[action.card.id] = action.card
            return newState
        case PUT_CARD:
            newState = {...state}
            newState.userCards[action.card.id] = [action.card]
            return newState
        case DELETE_CARD:
            newState = { ...state }
            delete newState[action.cardId]
            return newState
        default:
            return state
    }
}

export default cardReducer
