import {postsApi} from "../api/api";
import {commentCountPlus} from "./homeReducer";

const SET_POST_DATA = 'postReducer/SET_POST_DATA'
const GET_POST_DATA_FETCHING = 'postReducer/GET_POST_DATA_FETCHING'
const FORM_IS_FETCHING = 'postReducer/FORM_IS_FETCHING'

const initialState = {
    post: null,
    getPostFetching: false,
    formIsFetching: false
}

export const postReducer = (state = initialState, action) => {
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
        default:
            return state
    }
}

const formIsFetching = isFetching => ({type: FORM_IS_FETCHING, isFetching})
const getPostDataFetching = isFetching => ({type: GET_POST_DATA_FETCHING, isFetching})
const setPostData = post => ({type: SET_POST_DATA,post})

export const getPostDataById = postId => async dispatch => {
    dispatch(getPostDataFetching(true))
    try {
        const res = await postsApi.getPostById(postId)
        if(res.status === 200){
            dispatch(getPostDataFetching(false))
            dispatch(setPostData(res.data))
        }
        return ''
    }
    catch (err) {
        dispatch(getPostDataFetching(false))
        console.log(err)
        console.log(err.response.data)
    }
}

export const sendComment = (postId,comment) => async dispatch => {
    dispatch(formIsFetching(true))
    try {
        const res = await postsApi.commentPost(postId,comment)
        if(res.status === 200){
            dispatch(formIsFetching(false))
            dispatch(commentCountPlus(postId))
            console.log(res)
        }
    }
    catch (err) {
        dispatch(formIsFetching(false))
        console.log(err)
        console.log(err.response.data)
    }
}