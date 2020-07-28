import React, {useEffect, useState} from "react"
import classes from './Post.module.scss'
import {connect} from "react-redux" 
import {likePost, unLikePost} from "../../store/homeReducer"
import CommentModal from "../modals/CommnetModal/CommentModal"
import { getPostDataById } from "../../store/fullPostReducer" 
import PostContent from "./PostContent/PostContent"
import {Link, withRouter} from "react-router-dom" 
import {likeUserProfilePost, unlikeUserProfilePost} from "../../store/usersReducer"
import DeletePost from "./DeletePost" 

const Post = ({isAuth,post,likePost, likeUserProfilePost, unlikeUserProfilePost,likedPosts,unLikePost,getPostDataById,credentials,isUserProfilePost = false,commentModalOpen = false,...props}) => {
    const[isAuthUserPost,setIsAuthUserPost] = useState(false)
    const[commentModal,setCommentModal] = useState(false)
    const[oldPathState,setOldPath] = useState(null)
    const[isPostLiked,setIsPostLiked] = useState(false)

    useEffect(() => {
        if(credentials && credentials.handle === post.userHandle){
            setIsAuthUserPost(true)
        } else {
            setIsAuthUserPost(false)
        }

        if(likedPosts && likedPosts.some(likedPost => likedPost.postId === post.postId)){
            setIsPostLiked(true)
        } else {
            setIsPostLiked(false)
        }

        if(commentModal){
            document.body.style.overflow = 'hidden'
        } else document.body.style.overflow = ''

        if(commentModalOpen){
            openCommentModal()
        }
    })

    const likePostHandler = () => {
        if(!isAuth){
            props.history.push('/login')
        }
        if(credentials){
            isUserProfilePost ? likeUserProfilePost(post.postId) : likePost(post.postId)
        }
    }

    const unLikePostHandler = () => {
        if(!isAuth){
            props.history.push('/login')
        }
        if(credentials){
            isUserProfilePost ? unlikeUserProfilePost(post.postId) : unLikePost(post.postId)
        }
    }

    const openCommentModal = () => {
        let oldPath = window.location.pathname
        const newPath = `/users/${post.userHandle}/post/${post.postId}`

        if (oldPath === newPath) oldPath = `/users/${post.userHandle}`

        window.history.pushState(null, null, newPath)

        setOldPath(oldPath)
        setCommentModal(true)
        getPostDataById(post.postId)
    }

    const closeCommentModal = () => {
        const path = oldPathState || `/users/${post.userHandle}`
        props.history.push(path)
        setCommentModal(false)
    }

    return (
        <div className={classes.post}>
            { !isAuthUserPost ? <Link style={{width: '40%'}} to={`/users/${post.userHandle}`}>
                <div className={classes.userPhoto} style={{'background': `url(${post.userImage}) center / cover no-repeat`}}/>
            </Link>
                : <a style={{width: '40%'}}>
                    <div className={classes.userPhoto} style={{'background': `url(${post.userImage}) center / cover no-repeat`}}/>
                </a>
            }
            <DeletePost isAuthUserPost={isAuthUserPost} deletedPost={post.postId}/>
            <PostContent
                post={post}
                isPostLiked={isPostLiked}
                likePostHandler={likePostHandler}
                unLikePostHandler={unLikePostHandler}
                openCommentModal={openCommentModal}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                isAuthUserPost={isAuthUserPost}
            />
            {
                commentModal && <CommentModal
                    isPostLiked={isPostLiked}
                    likePostHandler={likePostHandler}
                    unLikePostHandler={unLikePostHandler}
                    closeCommentModal={closeCommentModal}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    isUserProfilePost={isUserProfilePost}
                    isAuthUserPost={isAuthUserPost}
                />
            }

        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    likedPosts: state.profilePage.likes,
    credentials: state.profilePage.credentials
})

export default withRouter(connect(mapStateToProps,{likePost, likeUserProfilePost,unLikePost, unlikeUserProfilePost,getPostDataById})(Post))