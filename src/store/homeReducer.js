import { postsApi} from "../api/api"
import { updateLikedPosts } from "./profileReducer"
import {
    addNewPostForUsersProfile,
    removePostForUsersProfile,
    userProfileLikeCountMinus,
    userProfileLikeCountPlus
} from "./usersReducer"

const SET_ALL_POSTS = 'homeReducer/SET_ALL_POSTS'
const ADD_NEW_POST_SUCCESS = 'homeReducer/ADD_NEW_POST_SUCCESS'
const SET_FORM_FETCHING = 'homeReducer/SET_FORM_FETCHING'
const UPDATE_POSTS_USER_PHOTO = 'homeReducer/UPDATE_POSTS_USER_PHOTO'
const LIKE_COUNT_MINUS = 'homeReducer/LIKE_COUNT_MINUS'
const LIKE_COUNT_PLUS = 'homeReducer/LIKE_COUNT_PLUS'
const COMMENT_COUNT_PLUS = 'homeReducer/COMMENT_COUNT_PLUS'
const COMMENT_COUNT_MINUS = 'homeReducer/COMMENT_COUNT_MINUS'
const REMOVE_POST = 'homeReducer/REMOVE_POST'
const SET_CREATE_POST_MODAL = 'homeReducer/SET_CREATE_POST_MODAL'
const ADD_NEW_POST_ERROR = 'homeReducer/ADD_NEW_POST_ERROR'
const SET_IS_HOME_PAGE_FETCHING = 'homeReducer/SET_IS_HOME_PAGE_FETCHING'

const initialState = {
    posts: [],
    isHomePageFetching: false,
    isFormFetching: false,
    createPostModalOpen: false,
    addNewPostError: null
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_POSTS:
            return {
                ...state,
                posts: action.posts
            }
        case SET_IS_HOME_PAGE_FETCHING:
            return {
                ...state,
                isHomePageFetching: action.isFetching
            }
        case ADD_NEW_POST_SUCCESS:
            return {
                ...state,
                posts: [action.post,...state.posts]
            }
        case ADD_NEW_POST_ERROR:
            return {
                ...state,
                addNewPostError: action.error
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
        case SET_CREATE_POST_MODAL:
            return {
                ...state,
                createPostModalOpen: action.isModal
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

const setAllPosts = posts => ({type: SET_ALL_POSTS, posts})
export const setIsHomePageFetching = isFetching => ({type: SET_IS_HOME_PAGE_FETCHING, isFetching})
const addNewPostSuccess = post => ({type:ADD_NEW_POST_SUCCESS, post})
const setAddNewPostError = error => ({type: ADD_NEW_POST_ERROR, error})
const setFormFetching = isFormFetching => ({type: SET_FORM_FETCHING, isFormFetching})
const removePost = postId => ({type: REMOVE_POST, postId})
export const setCreatePostModalOpen = isModal => ({type: SET_CREATE_POST_MODAL, isModal})
export const commentCountPlus = postId => ({type: COMMENT_COUNT_PLUS, postId})
export const commentCountMinus = postId => ({type: COMMENT_COUNT_MINUS, postId})
const likeCountPlus = postId => ({type: LIKE_COUNT_PLUS, postId})
const likeCountMinus = postId => ({type: LIKE_COUNT_MINUS, postId})
export const updatePostsUserPhoto = (image,handle) => ({type: UPDATE_POSTS_USER_PHOTO, image,handle})

export const getPosts = () => async dispatch => {
    dispatch(setIsHomePageFetching(true))
    try {
        const res = await postsApi.getPosts()
        if(res.status === 200){
            dispatch(setAllPosts(res.data))
            dispatch(setIsHomePageFetching(false))
        }
    }
    catch (err) {
        if (err.response.status === 500) {
            // error
        }
    }
}

export const addNewPost = post => async dispatch => {
    dispatch(setFormFetching(true))
    try {
        const res = await postsApi.addNewPost(post)
        if(res.status === 200){
            dispatch(addNewPostSuccess(res.data))
            dispatch(addNewPostForUsersProfile(res.data))
            dispatch(setAddNewPostError(null))
            dispatch(setCreatePostModalOpen(false))
            dispatch(setFormFetching(false))
        }
    }
    catch (err) {
        dispatch(setFormFetching(false))
        if(err.response){
            if (err.response.status === 400) {
                dispatch(setAddNewPostError(err.response.data.error))
            }
            if (err.response.status === 500) {
                dispatch(setAddNewPostError('Something went wrong, please try again later'))
            }
        }
    }
}


export const likePost = postId => async dispatch => {
    try {
        const res = await postsApi.likePost(postId)
        if(res.status === 200){
            dispatch(updateLikedPosts(postId,true))
            dispatch(userProfileLikeCountPlus(postId))
            dispatch(likeCountPlus(postId))
        }
    }
    catch (err) {
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

export const unLikePost = postId => async dispatch => {
    try {
        const res = await postsApi.unlikePost(postId)
        if(res.status === 200){
            dispatch(updateLikedPosts(postId,false))
            dispatch(likeCountMinus(postId))
            dispatch(userProfileLikeCountMinus(postId))
        }
    }
    catch (err) {
        if(err.response){
            if (err.response.status === 400) {
                //Post not found
                //Post not liked
            }
            if (err.response.status === 500) {
                //error
            }
        }
    }
}

export const deletePost = postId => async dispatch => {
    dispatch(setFormFetching(true))
    try {
        const res = await postsApi.deletePost(postId)
        if(res.status === 200){
            dispatch(removePost(postId))
            dispatch(removePostForUsersProfile(postId))
            dispatch(setFormFetching(false))
        }
    }
    catch (err) {
        dispatch(setFormFetching(false))
        if(err.response){
            if (err.response.status === 400) {
                //Post not found
            }
            if (err.response.status === 403) {
                //Unauthorized
            }
            if (err.response.status === 500) {
                //error
            }
        }
    }
}
