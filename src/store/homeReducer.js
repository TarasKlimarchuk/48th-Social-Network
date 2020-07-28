import { postsApi} from "../api/api";
import {updateLikedPosts} from "./profileReducer";

const SET_ALL_POSTS_SUCCESS = 'homeReducer/SET_ALL_POSTS_SUCCESS'
const ADD_NEW_POST_SUCCESS = 'homeReducer/ADD_NEW_POST_SUCCESS'
const SET_FORM_FETCHING = 'homeReducer/SET_FORM_FETCHING'
const UPDATE_POSTS_USER_PHOTO = 'homeReducer/UPDATE_POSTS_USER_PHOTO'
const LIKE_COUNT_MINUS = 'homeReducer/LIKE_COUNT_MINUS'
const LIKE_COUNT_PLUS = 'homeReducer/LIKE_COUNT_PLUS'
const COMMENT_COUNT_PLUS = 'homeReducer/COMMENT_COUNT_PLUS'
const REMOVE_POST = 'homeReducer/REMOVE_POST'

const initialState = {
    posts: [],
    isFormFetching: false
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.posts
            }
        case ADD_NEW_POST_SUCCESS:
            return {
                ...state,
                posts: [action.post,...state.posts]
            }
        case SET_FORM_FETCHING:
            return {
                ...state,
                isFormFetching: action.isFormFetching
            }
        case REMOVE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.postId !== action.postId)
            }
        case UPDATE_POSTS_USER_PHOTO:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if(post.userHandle === action.handle){
                        return {...post, userImage: action.image}
                    }
                    return post
                })
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
export const commentCountPlus = postId => ({type: COMMENT_COUNT_PLUS, postId})
export const updatePostsUserPhoto = (image,handle) => ({type: UPDATE_POSTS_USER_PHOTO, image,handle})
const removePost = postId => ({type: REMOVE_POST, postId})
const setFormFetching = isFormFetching => ({type: SET_FORM_FETCHING, isFormFetching})
const addNewPostSuccess = post => ({type:ADD_NEW_POST_SUCCESS, post})
const setAllPostsSuccess = posts => ({type: SET_ALL_POSTS_SUCCESS, posts})
const likeCountPlus = postId => ({type: LIKE_COUNT_PLUS, postId})
const likeCountMinus = postId => ({type: LIKE_COUNT_MINUS, postId})

export const getPosts = () => async dispatch => {
    try {
        const res = await postsApi.getPosts()
        if(res.status === 200){
            dispatch(setAllPostsSuccess(res.data))
        }
    }
    catch (err) {
        console.log(err)
    }
}

export const addNewPost = post => async dispatch => {
    try {
        dispatch(setFormFetching(true))
        const res = await postsApi.addNewPost(post)
        if(res.status === 200){
            dispatch(addNewPostSuccess(res.data))
            dispatch(setFormFetching(false))
        }
        return ""
    }
    catch (err) {
        dispatch(setFormFetching(false))
        console.log(err.response)
        console.log(err.response.data)
    }
}

export const likePost = postId => async dispatch => {
    try {
        const res = await postsApi.likePost(postId)
        if(res.status === 200){
            dispatch(updateLikedPosts(postId,true))
            dispatch(likeCountPlus(postId))
        }
    }
    catch (err) {
        console.log(err.response.data)
    }
}

export const unLikePost = postId => async dispatch => {
    try {
        const res = await postsApi.unlikePost(postId)
        if(res.status === 200){
            dispatch(updateLikedPosts(postId,false))
            dispatch(likeCountMinus(postId))
        }
    }
    catch (err) {
        console.log(err.response.data)
    }
}

export const deletePost = postId => async dispatch => {
    try {
        const res = await postsApi.deletePost(postId)
        if(res.status === 200){
            dispatch(removePost(postId))
            return ''
        }
    }
    catch (err) {
        console.log(err.response.data)
    }
}
