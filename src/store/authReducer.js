import {usersApi} from "../api/api";
import axios from 'axios'
import { setUserDataNull } from "./profileReducer";

const SET_IS_FETCHING = 'authReducer/SET_IS_FETCHING'
const SET_CREDENTIALS_SUCCESS = 'authReducer/SET_CREDENTIALS_SUCCESS'
const SET_CREDENTIALS_ERROR = 'authReducer/SET_CREDENTIALS_ERROR'
const INITIALIZE_APP = 'authReducer/INITIALIZE_APP'

const initialState = {
    isFetching: false,
    credentialsError: null,
    isAuth: false
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case SET_CREDENTIALS_SUCCESS:
            return {
                ...state,
                credentialsError: null,
                isAuth: true
            }
        case SET_CREDENTIALS_ERROR:
            return {
                ...state,
                credentialsError: action.error
            }
        case INITIALIZE_APP:
            return {
                ...state,
                isAuth: action.isAuth
            }
        default:
            return state
    }
}

export const initializeApp = isAuth => ({type: INITIALIZE_APP, isAuth})
const setCredentialsSuccess = () => ({type: SET_CREDENTIALS_SUCCESS})
const setCredentialsError = error => ({type: SET_CREDENTIALS_ERROR, error})
const setIsFetching = isFetching => ({type: SET_IS_FETCHING, isFetching})

export const signup = (handle,email,password,confirmPassword) => async dispatch => {
    try {
        dispatch(setIsFetching(true))
        const res = await usersApi.signup(handle,email,password,confirmPassword)
        if(res.status === 200){
            localStorage.setItem('FBIdToken',`Bearer ${res.data.token}`)
            dispatch(setCredentialsSuccess())
            dispatch(setIsFetching(false))
        }
    }
    catch (err) {
        dispatch(setCredentialsError(err.response.data))
        dispatch(setIsFetching(false))
    }
}

export const login = (email,password) => async dispatch => {
    try {
        dispatch(setIsFetching(true))
        const res = await usersApi.login(email,password)
        if(res.status === 200){
            localStorage.setItem('FBIdToken',`Bearer ${res.data.token}`)
            dispatch(setCredentialsSuccess())
            dispatch(setIsFetching(false))
        }
    }
    catch (err) {
        dispatch(setCredentialsError(err.response.data))
        dispatch(setIsFetching(false))
    }
}

export const signout = () => async dispatch => {
    try {
        const res = await usersApi.signout()
        if(res.status === 200){
            localStorage.removeItem('FBIdToken')
            dispatch(setUserDataNull())
            delete axios.defaults.headers.common['Authorization'];
            dispatch(initializeApp(false))
        }
    }
    catch (err) {
        console.log(err.response.data)
    }
}

