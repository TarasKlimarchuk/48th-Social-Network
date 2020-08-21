import { postsApi} from "../api/api"
import { app } from '../FBconfig/config'
import { updatePostsUserPhoto } from "./homeReducer"

const SET_USER_DATA = 'profileReducer/SET_USER_DATA'
const SET_IS_FETCHING = 'profileReducer/SET_IS_FETCHING'
const SET_FORM_FETCHING = 'profileReducer/SET_FORM_FETCHING'
const UPDATE_USER_PHOTO = 'profileReducer/UPDATE_USER_PHOTO'
const UPDATE_USER_DATA = 'profileReducer/UPDATE_USER_DATA'
const UPDATE_LIKED_POSTS = 'profileReducer/UPDATE_LIKED_POSTS'
const UPDATE_NOTIFICATIONS = 'profileReducer/UPDATE_NOTIFICATIONS'
const SET_USER_DATA_NULL = 'profilePage/SET_USER_DATA_NULL'
const SET_EDIT_PHOTO_MODAL = 'profilePage/SET_EDIT_PHOTO_MODAL'
const SET_EDIT_PROFILE_MODAL = 'profilePage/SET_EDIT_PROFILE_MODAL'
const ADD_USER_DETAILS_ERROR = 'profilePage/ADD_USER_DETAILS_ERROR'

const initialState = {
    credentials: null,
    likes: [],
    notifications: [],
    isProfileFetching: false,
    isFormFetching: false,
    addUserDetailsError: null,
    editPhotoModal: false,
    editProfileModal: false
}

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state, ...action.payload
            }
        case SET_USER_DATA_NULL:
            return {
                ...state,
                credentials: null,
                likes: null
            }
        case ADD_USER_DETAILS_ERROR:
            return {
                ...state,
                addUserDetailsError: action.error
            }
        case SET_IS_FETCHING:
            return {
                ...state,
                isProfileFetching: action.isFetching
            }
        case SET_FORM_FETCHING:
            return {
                ...state,
                isFormFetching: action.isFetching
            }
        case UPDATE_USER_DATA:
            return {
                ...state,
                credentials: { ...state.credentials, bio: action.bio, location: action.location}
            }
        case UPDATE_USER_PHOTO:
            return {
                ...state, credentials: {...state.credentials, imageUrl: action.image}
            }
        case UPDATE_LIKED_POSTS:
            return {
                ...state,
                likes: action.event ? [...state.likes, {postId: action.postId, userHandle: state.credentials.handle}]
                    : state.likes.filter(post => post.postId !== action.postId)
            }
        case UPDATE_NOTIFICATIONS:
            return {
                ...state,
                notifications: state.notifications.map(not => {
                    for(let id of action.arr){
                        if(not.notificationId === id){
                            return {...not, read: true}
                        }
                    }
                    return not
                })
            }
        case SET_EDIT_PHOTO_MODAL:
            return {
                ...state,
                editPhotoModal: action.isModal
            }
        case SET_EDIT_PROFILE_MODAL:
            return {
                ...state,
                editProfileModal: action.isModal
            }
        default:
            return state
    }
}

const setUserData = payload => ({type: SET_USER_DATA, payload})
export const setUserDataNull = () => ({type: SET_USER_DATA_NULL})
const setIsProfileFetching = isFetching => ({type: SET_IS_FETCHING, isFetching})
export const updateLikedPosts = (postId,event) => ({type: UPDATE_LIKED_POSTS, postId,event})
export const setEditPhotoModal = isModal => ({type: SET_EDIT_PHOTO_MODAL, isModal})
export const setEditProfileModal = isModal => ({type: SET_EDIT_PROFILE_MODAL, isModal})
export const setFormFetching = isFetching => ({type: SET_FORM_FETCHING, isFetching})
const addUserDetailsError = error => ({type: ADD_USER_DETAILS_ERROR, error})
const updateNotifications = arr => ({type: UPDATE_NOTIFICATIONS, arr})
const updateUserData = (bio,location) => ({type: UPDATE_USER_DATA, bio,location})
const updateUserPhoto = image => ({type: UPDATE_USER_PHOTO, image})

export const getAuthUserDetails = () => async dispatch => {
    try {
        dispatch(setIsProfileFetching(true))
        const res = await postsApi.getAuthUser()
        if(res.status === 200){
            dispatch(setUserData(res.data))
            dispatch(setIsProfileFetching(false))
        }
    }
    catch (err) {
        dispatch(setIsProfileFetching(false))
        if (err.response && err.response.status === 500) {
            //error
        }
    }
}

export const addUserDetails = (bio,location) => async dispatch => {
    dispatch(setFormFetching(true))
    try {
        const res = await postsApi.addUserDetails(bio,location)
        if(res.status === 200){
            dispatch(setFormFetching(false))
            dispatch(updateUserData(bio,location))
            dispatch(addUserDetailsError(null))
            dispatch(setEditProfileModal(false))
        }
    }
    catch (err) {
        dispatch(setFormFetching(false))
        if(err.response) {
            if (err.response.status === 400) {
                dispatch(addUserDetailsError(err.response.data.error))
            }
            if (err.response.status === 500) {
                dispatch(addUserDetailsError('Something went wrong, please try again later'))
            }
        }
    }
}

export const editPhoto = (imageUrl,handle) => async dispatch => {
    const db = app.firestore()
    try {
        db.doc(`/users/${handle}`).update({ imageUrl }).then(() => {
            return db.collection('posts').where('userHandle', '==', handle)
                .get()
                .then(posts => {
                    posts.forEach(doc => {
                        doc.ref.update({userImage: imageUrl})
                    })
                })
                .then(() => {
                    return db.collection('comments').where('userHandle', '==', handle)
                        .get()
                        .then(comments => {
                            comments.forEach(doc => {
                                doc.ref.update({userImage: imageUrl})
                            })
                        })
                })
                .then(() => {
                    dispatch(setFormFetching(false))
                    dispatch(setEditPhotoModal(false))
                    dispatch(updateUserPhoto(imageUrl))
                    dispatch(updatePostsUserPhoto(imageUrl,handle))
            })
        })
    }
    catch (err) {
        dispatch(setFormFetching(true))
        console.log(err)
    }
}

export const markNotificationsRead = arr => async dispatch => {
    try {
        const res = await postsApi.markNotificationsRead(arr)
        if(res.status === 200){
            dispatch(updateNotifications(arr))
        }
    }
    catch (err) {
        if (err.response && err.response.status === 500) {
            //error
        }
    }
}