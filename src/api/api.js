import axios from "axios"

axios.defaults.baseURL = 'https://us-central1-social-app-portfolio.cloudfunctions.net/api'

function getOptions() {
    const token = localStorage.FBIdToken
    if (token) {
        return {
            headers: {'Authorization': token}
        }
    }
}

export const usersApi = {
    signup(handle, email, password, confirmPassword) {
        return axios.post('/signup', {handle, email, password, confirmPassword})
    },
    login(email, password) {
        return axios.post('/login', {email, password})
    },
    logout() {
        return axios.get('/signout')
    },
    getUserDetails(handle) {
        return axios.get(`/user/${handle}`)
    }
}


export const postsApi = {
    getPosts() {
        return axios.get('/posts')
    },
    addNewPost(body) {
        return axios.post('/post', {body})
    },
    getAuthUser() {
        return axios.get('/user'/*,getOptions()*/)
    },
    getPostById(postId) {
        return axios.get(`/post/${postId}`)
    },
    addUserDetails(bio, location) {
        return axios.post('/user', {bio, location})
    },
    likePost(postId) {
        return axios.get(`/post/${postId}/like`)
    },
    unlikePost(postId) {
        return axios.get(`/post/${postId}/unlike`)
    },
    commentPost(postId, body) {
        return axios.post(`/post/${postId}/comment`, {body})
    },
    deleteComment(postId, commentId) {
        return axios.delete(`/comment/${postId}/${commentId}`)
    },
    deletePost(postId) {
        return axios.delete(`/post/${postId}`)
    },
    markNotificationsRead(arr) {
        return axios.post('/notifications', arr)
    }
}