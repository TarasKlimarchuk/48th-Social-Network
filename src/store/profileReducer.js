import { postsApi} from "../api/api";
import { app } from '../FBconfig/config'
import { updatePostsUserPhoto } from "./homeReducer";

const SET_USER_DATA_SUCCESS = 'profileReducer/SET_USER_DATA_SUCCESS'
const SET_IS_FETCHING = 'profileReducer/SET_IS_FETCHING'
const SET_FORM_FETCHING = 'profileReducer/SET_FORM_FETCHING'
const UPDATE_USER_PHOTO = 'profileReducer/UPDATE_USER_PHOTO'
const UPDATE_USER_DATA = 'profileReducer/UPDATE_USER_DATA'
const UPDATE_LIKED_POSTS = 'profileReducer/UPDATE_LIKED_POSTS'
const UPDATE_NOTIFICATIONS = 'profileReducer/UPDATE_NOTIFICATIONS'
const SET_USER_DATA_NULL = 'profilePage/SET_USER_DATA_NULL'

const initialState = {
    credentials: null,
    likes: [],
    notifications: [],
    isFetching: false,
    isFormFetching: false
}

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA_SUCCESS:
            return {
                ...state, ...action.payload
            }
        case SET_USER_DATA_NULL:
            return {
                ...state,
                credentials: null,
                likes: null
            }
        case SET_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
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
        default:
            return state
    }
}

export const setUserDataNull = () => ({type: SET_USER_DATA_NULL})
export const updateLikedPosts = (postId,event) => ({type: UPDATE_LIKED_POSTS, postId,event})
export const setUserDataSuccess = payload => ({type: SET_USER_DATA_SUCCESS, payload})
const updateNotifications = arr => ({type: UPDATE_NOTIFICATIONS, arr})
const updateUserData = (bio,location) => ({type: UPDATE_USER_DATA, bio,location})
const updateUserPhoto = image => ({type: UPDATE_USER_PHOTO, image})
const setFormFetching = isFetching => ({type: SET_FORM_FETCHING, isFetching})
const setIsFetching = isFetching => ({type: SET_IS_FETCHING, isFetching})

export const getAuthUserDetails = () => async dispatch => {
    try {
        dispatch(setIsFetching(true))
        const res = await postsApi.getAuthUser()
        if(res.status === 200){
            dispatch(setUserDataSuccess(res.data))
            dispatch(setIsFetching(false))
        }
    }
    catch (err) {
        dispatch(setIsFetching(false))
        console.log(err)
    }
}

export const addUserDetails = (bio,location) => async dispatch => {
    try {
        dispatch(setFormFetching(true))
        const res = await postsApi.addUserDetails(bio,location)
        if(res.status === 200){
            dispatch(setFormFetching(false))
            dispatch(updateUserData(bio,location))
            return ''
        }
    }
    catch (err) {
        dispatch(setFormFetching(false))
        console.log(err.response.data)
    }
}

export const editPhoto = (imageUrl,handle) => async dispatch => {
    const db = app.firestore()
    dispatch(setFormFetching(true))
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
                    dispatch(updateUserPhoto(imageUrl))
                    dispatch(updatePostsUserPhoto(imageUrl,handle))
                    return ''
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
        console.log(err)
    }
}