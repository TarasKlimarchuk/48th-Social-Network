import { postsApi } from "../api/api"
import { commentCountMinus, commentCountPlus } from "./homeReducer"
import { userProfileCommentCountMinus, userProfileCommentCountPlus } from "./usersReducer"
import axios from "axios";
import {authorizationsSuccess} from "./authReducer";

const SET_POST_DATA = 'fullPostReducer/SET_POST_DATA'
const GET_POST_DATA_ERROR = 'fullPostReducer/GET_POST_DATA_ERROR'
const GET_POST_DATA_FETCHING = 'fullPostReducer/GET_POST_DATA_FETCHING'
const ADD_NEW_COMMENT = 'fullPostReducer/ADD_NEW_COMMENT'
const SET_COMMENT_ERROR = 'fullPostReducer/SET_COMMENT_ERROR'
const FORM_IS_FETCHING = 'fullPostReducer/FORM_IS_FETCHING'
const REMOVE_COMMENT = 'fullPostReducer/REMOVE_COMMENT'
const SET_IS_DELETE_FETCHING = 'fullPostReducer/SET_IS_DELETE_FETCHING'

const initialState = {
    post: null,
    postDataError: false,
    getPostFetching: false,
    commentError: null,
    isFormFetching: false,
    isDeleteFetching: false
}

export const fullPostReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POST_DATA:
            return { ...state, post: action.post }
        case GET_POST_DATA_FETCHING:
            return {
                ...state,
                getPostFetching: action.isFetching
            }
        case GET_POST_DATA_ERROR:
            return {
                ...state,
                postDataError: action.bool
            }
        case ADD_NEW_COMMENT:
            return {
                ...state,
                post: {...state.post, comments: [{...action.payload, isAnimation: true }, ...state.post.comments]}
            }
        case SET_COMMENT_ERROR:
            return {
                ...state,
                commentError: action.error
            }
        case FORM_IS_FETCHING:
            return {
                ...state,
                isFormFetching: action.isFetching
            }
        case REMOVE_COMMENT:
            return {
                ...state,
                post: {...state.post, comments: state.post.comments.filter(comment => comment.commentId !== action.commentId)}
            }
        case SET_IS_DELETE_FETCHING:
            return {
                ...state,
                isDeleteFetching: action.isFetching
            }
        default:
            return state
    }
}

const setPostData = post => ({type: SET_POST_DATA,post})
const getPostDataError = bool => ({type: GET_POST_DATA_ERROR, bool})
const getPostDataFetching = isFetching => ({type: GET_POST_DATA_FETCHING, isFetching})
export const addNewComment = payload => ({type: ADD_NEW_COMMENT, payload})
export const setCommentError = error => ({type: SET_COMMENT_ERROR, error})
export const setIsFormFetching = isFetching => ({type: FORM_IS_FETCHING, isFetching})
const removeComment = commentId => ({type: REMOVE_COMMENT, commentId})
const setIsDeleteFetching = isFetching => ({type: SET_IS_DELETE_FETCHING, isFetching})

export const getPostDataById = postId => async dispatch => {
    dispatch(getPostDataFetching(true))
    try {
        const res = await postsApi.getPostById(postId)
        if(res.status === 200){
            dispatch(getPostDataError(false))
            dispatch(setPostData(res.data))
            dispatch(getPostDataFetching(false))
        }
    }
    catch (err) {
        dispatch(getPostDataFetching(false))
        if(err.response) {
            if (err.response.status === 400) {
                dispatch(getPostDataError(true))
            }
        }
    }
}

export const sendComment = (postId,comment) => async dispatch => {
    dispatch(setIsFormFetching(true))
    try {
        const res = await postsApi.commentPost(postId,comment)
        if(res.status === 200){
            dispatch(setIsFormFetching(false))
            dispatch(commentCountPlus(postId))
            dispatch(userProfileCommentCountPlus(postId))
            dispatch(addNewComment(res.data))
        }
    }
    catch (err) {
        dispatch(setIsFormFetching(false))
        if(err.response) {
            if (err.response.status === 400) {
                dispatch(setCommentError(err.response.data.error))
            }
            if (err.response.status === 403) {
                localStorage.removeItem('FBIdToken')
                delete axios.defaults.headers.common['Authorization']
                dispatch(authorizationsSuccess(false))
                window.location.href = '/login'
            }
            if (err.response.status === 500) {
                dispatch(setCommentError('Something went wrong, please try again later'))
            }
        }
    }
}

export const deleteComment = (postId,commentId) => async dispatch => {
    dispatch(setIsDeleteFetching(true))
    try {
        const res = await postsApi.deleteComment(postId,commentId)
        if(res.status === 200){
            dispatch(removeComment(commentId))
            dispatch(commentCountMinus(postId))
            dispatch(userProfileCommentCountMinus(postId))
            dispatch(setIsDeleteFetching(false))
        }
    }
    catch (err) {
        dispatch(setIsDeleteFetching(false))
        if(err.response) {
            if (err.response.status === 403) {
                localStorage.removeItem('FBIdToken')
                delete axios.defaults.headers.common['Authorization']
                dispatch(authorizationsSuccess(false))
                window.location.href = '/login'
            }
        }
    }
}