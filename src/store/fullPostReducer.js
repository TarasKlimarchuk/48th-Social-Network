import {postsApi} from "../api/api";
import {commentCountPlus} from "./homeReducer";

const SET_POST_DATA = 'fullPostReducer/SET_POST_DATA'
const GET_POST_DATA_FETCHING = 'fullPostReducer/GET_POST_DATA_FETCHING'
const FORM_IS_FETCHING = 'fullPostReducer/FORM_IS_FETCHING'
const ADD_NEW_COMMENT = 'fullPostReducer/ADD_NEW_COMMENT'
const GET_POST_DATA_ERROR = 'fullPostReducer/GET_POST_DATA_ERROR'

const initialState = {
    post: null,
    postDataError: false,
    getPostFetching: false,
    formIsFetching: false
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
        case FORM_IS_FETCHING:
            return {
                ...state,
                formIsFetching: action.isFetching
            }
        case ADD_NEW_COMMENT:
            return {
                ...state,
                post: {...state.post, comments: [action.payload, ...state.post.comments]}
            }
        case GET_POST_DATA_ERROR:
            return {
                ...state,
                postDataError: action.bool
            }
        default:
            return state
    }
}

const getPostDataError = bool => ({type: GET_POST_DATA_ERROR, bool})
const getPostDataFetching = isFetching => ({type: GET_POST_DATA_FETCHING, isFetching})
const setPostData = post => ({type: SET_POST_DATA,post})
export const addNewComment = payload => ({type: ADD_NEW_COMMENT, payload})
export const formIsFetching = isFetching => ({type: FORM_IS_FETCHING, isFetching})

export const getPostDataById = postId => async dispatch => {
    dispatch(getPostDataFetching(true))
    try {
        const res = await postsApi.getPostById(postId)
        if(res.status === 200){
            dispatch(getPostDataError(false))
            dispatch(getPostDataFetching(false))
            dispatch(setPostData(res.data))
        }
    }
    catch (err) {
        dispatch(getPostDataFetching(false))
        dispatch(getPostDataError(true))
        console.log(err)
    }
}

export const sendComment = (postId,comment) => async dispatch => {
    dispatch(formIsFetching(true))
    try {
        const res = await postsApi.commentPost(postId,comment)
        if(res.status === 200){
            dispatch(formIsFetching(false))
            dispatch(commentCountPlus(postId))
            dispatch(addNewComment(res.data))
        }
    }
    catch (err) {
        dispatch(formIsFetching(false))
        console.log(err)
        console.log(err.response.data)
    }
}