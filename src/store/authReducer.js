import { usersApi } from "../api/api"
import axios from 'axios'
import { setUserDataNull } from "./profileReducer"

const AUTHORIZATION_SUCCESS = 'authReducer/AUTHORIZATION_SUCCESS'
const SIGNUP_ERROR = 'authReducer/SIGNUP_ERROR'
const LOGIN_ERROR = 'authReducer/LOGIN_ERROR'
const SET_IS_FETCHING = 'authReducer/SET_IS_FETCHING'

const initialState = {
    loginError: null,
    signupError: null,
    isAuth: false,
    isFormFetching: false
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHORIZATION_SUCCESS:
            return {
                ...state,
                loginError: null,
                signupError: null,
                isAuth: action.isAuth
            }
        case LOGIN_ERROR:
            return {
                ...state,
                loginError: action.error,
                isAuth: false
            }
        case SIGNUP_ERROR:
            return {
                ...state,
                signupError: action.error,
                isAuth: false
            }
        case SET_IS_FETCHING:
            return {
                ...state,
                isFormFetching: action.isFormFetching
            }
        default:
            return state
    }
}

export const authorizationsSuccess = (isAuth) => ({type: AUTHORIZATION_SUCCESS, isAuth})
const loginError = (error) => ({type: LOGIN_ERROR, error})
const signupError = (error) => ({type: SIGNUP_ERROR, error})
const setFormFetching = isFormFetching => ({type: SET_IS_FETCHING, isFormFetching})

export const signup = (handle,email,password,confirmPassword) => async dispatch => {
    dispatch(setFormFetching(true))
    dispatch(signupError(null))
    try {
        const res = await usersApi.signup(handle, email, password, confirmPassword)
        if (res.status === 200) {
            localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`)
            dispatch(authorizationsSuccess(true))
        }
        dispatch(setFormFetching(false))
    } catch (err) {
        dispatch(setFormFetching(false))
        if(err.response) {
            if (err.response.status === 400) {
                dispatch(signupError(err.response.data.error))
            }
            if (err.response.status === 500) {
                console.log(err.response)
                dispatch(signupError('Something went wrong, please try again later'))
            }
        }
    }
}

export const login = (email,password) => async dispatch => {
    dispatch(setFormFetching(true))
    dispatch(loginError(null))
    try {
        const res = await usersApi.login(email, password)
        if (res.status === 200) {
            localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`)
            dispatch(authorizationsSuccess(true))
        }
        dispatch(setFormFetching(false))
    } catch (err) {
        dispatch(setFormFetching(false))
        if(err.response) {
            if (err.response.status === 400) {
                dispatch(loginError(err.response.data.error))
            }
            if (err.response.status === 500) {
                dispatch(loginError('Something went wrong, please try again later'))
            }
        }
    }
}

export const signout = () => async dispatch => {
    const res = await usersApi.logout()
    if (res.status === 200) {
        localStorage.removeItem('FBIdToken')
        delete axios.defaults.headers.common['Authorization']
        dispatch(setUserDataNull())
        dispatch(authorizationsSuccess(false))
    }
}




