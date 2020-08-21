import classes from './CommentModal.module.scss'
import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import moment from "moment"
import { Preloader } from "../../common/Preloader/Preloaders"
import Comment from "./Comment/Comment"
import CommentForm from "./Comment/CommentForm"
import ModalWrapper from "../ModalWrapper"
import PostActions from "../../Post/PostContent/PostActions"

const FullPostModal = ({post,isPostLiked,isCommentModal,credentials,likePostHandler,unLikePostHandler,closeModal,likeCount,commentCount,getPostFetching}) => {

    useEffect(() => {
        if(isCommentModal){
            document.body.style.overflow = 'hidden'
        } else document.body.style.overflow = ''
    },[isCommentModal])

    return (
        <ModalWrapper closeModal={closeModal} modalWrapCenter={false}
                      style={{width: '550px'}}
                      isModalOpen={isCommentModal && credentials}
        >
            {
                !getPostFetching ? post &&
                    <div>
                        <div className={classes.post}>
                            <Link to={`/users/${post.userHandle}`}>
                                <div style={{background: `url(${post.userImage}) center / cover no-repeat`}} className={classes.photo}/>
                            </Link>
                            <div className={classes.postContent}>
                                <Link to={`/users/${post.userHandle}`} className={classes.handle}>{post.userHandle}</Link>
                                <small className={classes.createdAt}>{moment(post.createdAt).calendar()}</small>
                                <div className={classes.body}>{post.body}</div>
                                <div style={{marginLeft: '-100px'}}>
                                <PostActions
                                    isPostLiked={isPostLiked}
                                    likePostHandler={likePostHandler}
                                    unLikePostHandler={unLikePostHandler}
                                    likeCount={likeCount}
                                    commentCount={commentCount}
                                />
                                </div>
                            </div>
                            <div onClick={() => {closeModal()}} className={classes.closeButton}>
                                <FontAwesomeIcon className={classes.closeIcon} icon={faTimes} color='rgba(0,160,202,.8)'/>
                            </div>
                        </div>
                        <CommentForm postId={post.postId}/>
                        <div className={classes.comments}>
                            {
                                post.comments.map(comment => {
                                    return <Comment
                                        key={comment.createdAt}
                                        comment={comment}
                                        postId={post.postId}
                                    />
                                })
                            }
                        </div>
                    </div>
                    : <Preloader/>
            }
        </ModalWrapper>
        )
}

/*
* if(!postDataError){
        return (
            <ModalWrapper closeModal={closeCommentModal} modalWrapCenter={false} style={{'width':'550px'}} isModalOpen={fullPostModalOpen}>
                {
                    !getPostFetching && post ?
                        <div>
                            <div className={classes.post}>
                                { !isAuthUserPost ? <Link to={`/users/${post.userHandle}`}>
                                        <div style={{'background': `url(${post.userImage}) center / cover no-repeat`}} className={classes.photo}/>
                                    </Link>
                                    : <div><div style={{'background': `url(${post.userImage}) center / cover no-repeat`}} className={classes.photo}/></div>
                                }
                                <PostContent
                                    post={post}
                                    isPostLiked={isPostLiked}
                                    likePostHandler={likePostHandler}
                                    unLikePostHandler={unLikePostHandler}
                                    likeCount={likeCount}
                                    commentCount={commentCount}
                                />
                                <div onClick={closeCommentModal} className={classes.closeButton}>
                                    <FontAwesomeIcon className={classes.closeIcon} icon={faTimes} color='rgba(0,160,202,.8)'/>
                                </div>
                            </div>
                            <CommentForm postId={post.postId}/>
                            <div className={classes.comments}>
                                {
                                    post.comments.map(comment => {
                                        return <Comment
                                            key={comment.createdAt}
                                            comment={comment}
                                            isAuthUserPost={isAuthUserPost}
                                        />
                                    })
                                }
                            </div>
                        </div>
                        : <Preloader />
                }
            </ModalWrapper>
        )
    }
    return (
            <ModalWrapper closeModal={closeCommentModal} modalWrapCenter={false} style={{'width':'550px'}} isModalOpen={fullPostModalOpen}>
                Something went wrong, please try again
            </ModalWrapper>
        )*/

const mapStateToProps = state => ({
    post: state.postPage.post,
    postDataError: state.postPage.postDataError,
    getPostFetching: state.postPage.getPostFetching
})

export default connect(mapStateToProps)(FullPostModal)