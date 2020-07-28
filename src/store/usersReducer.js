import {postsApi, usersApi} from "../api/api";
import {updateLikedPosts} from "./profileReducer";
import {addNewComment, formIsFetching} from "./fullPostReducer";

const SET_USER_DETAILS = 'usersReducer/SET_USER_DETAILS'
const LIKE_COUNT_MINUS = 'usersReducer/LIKE_COUNT_MINUS'
const LIKE_COUNT_PLUS = 'usersReducer/LIKE_COUNT_PLUS'
const COMMENT_COUNT_PLUS = 'usersReducer/COMMENT_COUNT_PLUS'

const initialState = {
    posts: [],
    user: null
}

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DETAILS:
            return {
                ...state, ...action.payload
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
        default:
            return state
    }
}

export const userProfileLikeCountPlus = postId => ({type: LIKE_COUNT_PLUS, postId})
export const userProfileLikeCountMinus = postId => ({type: LIKE_COUNT_MINUS, postId})
const userProfileCommentCountPlus = postId => ({type: COMMENT_COUNT_PLUS, postId})
const setUserDetails = payload => ({type: SET_USER_DETAILS, payload})

export const getUserDetails = handle => async dispatch => {
    try {
        const res = await usersApi.getUserDetails(handle)
        if(res.status === 200){
            dispatch(setUserDetails(res.data))
        }
    }
    catch (err) {
        console.log(err)
    }
}

export const likeUserProfilePost = postId => async dispatch => {
    try {
        const res = await postsApi.likePost(postId)
        if(res.status === 200){
            dispatch(updateLikedPosts(postId,true))
            dispatch(userProfileLikeCountPlus(postId))
        }
    }
    catch (err) {
        console.log(err)
    }
}

export const unlikeUserProfilePost = postId => async dispatch => {
    try {
        const res = await postsApi.unlikePost(postId)
        if(res.status === 200){
            dispatch(updateLikedPosts(postId,false))
            dispatch(userProfileLikeCountMinus(postId))
        }
    }
    catch (err) {
        console.log(err)
    }
}

export const sendCommentToUserProfile = (postId,comment) => async dispatch => {
    dispatch(formIsFetching(true))
    try {
        const res = await postsApi.commentPost(postId,comment)
        if(res.status === 200){
            dispatch(formIsFetching(false))
            dispatch(userProfileCommentCountPlus(postId))
            dispatch(addNewComment(res.data))
        }
    }
    catch (err) {
        dispatch(formIsFetching(false))
        console.log(err)
    }
}
