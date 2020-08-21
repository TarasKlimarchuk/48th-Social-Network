import { usersApi } from "../api/api"

const SET_USER_DETAILS = 'usersReducer/SET_USER_DETAILS'
const LIKE_COUNT_MINUS = 'usersReducer/LIKE_COUNT_MINUS'
const LIKE_COUNT_PLUS = 'usersReducer/LIKE_COUNT_PLUS'
const COMMENT_COUNT_PLUS = 'usersReducer/COMMENT_COUNT_PLUS'
const COMMENT_COUNT_MINUS = 'userReducer/COMMENT_COUNT_MINUS'
const ADD_NEW_POST_SUCCESS = 'usersReducer/ADD_NEW_POST_SUCCESS'
const REMOVE_POST = 'homeReducer/REMOVE_POST'
const SET_GET_USER_DETAILS_FETCHING = 'homeReducer/SET_GET_USER_DETAILS_FETCHING'

const initialState = {
    posts: [],
    getUserDetailsFetching: false,
    user: null
}

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DETAILS:
            return {
                ...state, ...action.payload
            }
        case SET_GET_USER_DETAILS_FETCHING:
            return {
                ...state,
                getUserDetailsFetching: action.isFetching
            }
        case ADD_NEW_POST_SUCCESS:
            return {
                ...state,
                posts: [action.post,...state.posts]
            }
        case REMOVE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.postId !== action.postId)
            }
        case LIKE_COUNT_PLUS:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if(post.postId === action.postId){
                        return {...post, likeCount: post.likeCount+1}
                    }
                    return post
                })
            }
        case LIKE_COUNT_MINUS:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if(post.postId === action.postId){
                        return {...post, likeCount: post.likeCount-1}
                    }
                    return post
                })
            }
        case COMMENT_COUNT_PLUS:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if(post.postId === action.postId){
                        return {...post, commentCount: post.commentCount+1}
                    }
                    return post
                })
            }
        case COMMENT_COUNT_MINUS:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if(post.postId === action.postId){
                        return {...post, commentCount: post.commentCount-1}
                    }
                    return post
                })
            }
        default:
            return state
    }
}

const setGetUserDetailsFetching = isFetching => ({type: SET_GET_USER_DETAILS_FETCHING, isFetching})
export const userProfileLikeCountPlus = postId => ({type: LIKE_COUNT_PLUS, postId})
export const userProfileLikeCountMinus = postId => ({type: LIKE_COUNT_MINUS, postId})
export const addNewPostForUsersProfile = post => ({type:ADD_NEW_POST_SUCCESS, post})
export const removePostForUsersProfile = postId => ({type: REMOVE_POST, postId})
export const userProfileCommentCountPlus = postId => ({type: COMMENT_COUNT_PLUS, postId})
export const userProfileCommentCountMinus = postId => ({type: COMMENT_COUNT_MINUS, postId})
const setUserDetails = payload => ({type: SET_USER_DETAILS, payload})

export const getUserDetails = handle => async dispatch => {
    dispatch(setGetUserDetailsFetching(true))
    try {
        const res = await usersApi.getUserDetails(handle)
        if(res.status === 200){
            dispatch(setUserDetails(res.data))
            dispatch(setGetUserDetailsFetching(false))
        }
    }
    catch (err) {
        dispatch(setGetUserDetailsFetching(false))
        if(err.response){
            if (err.response.status === 400) {
                //Post not found
                //Post already liked
            }
            if (err.response.status === 500) {
                //error
            }
        }
    }
}