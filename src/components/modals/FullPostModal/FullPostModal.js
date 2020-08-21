import classes from './CommentModal.module.scss'
import React, {useEffect, useRef} from "react"
import {connect} from "react-redux" 
import {Preloader} from "../../common/Preloader/Preloaders"
import PostContent from "../../Post/PostContent/PostContent" 
import Comment from "./Comment/Comment" 
import { faTimes } from "@fortawesome/free-solid-svg-icons" 
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome" 
import {Link} from "react-router-dom"
import ModalWrapper from "../ModalWrapper" 
import CommentForm from "./CommentForm/CommentForm"
import {setFullPostModalOpen} from "../../../store/fullPostReducer";
import PostActions from "../../Post/PostContent/PostActions";
import moment from "moment";

const CommentModal = ({post,isPostLiked,isCommentModal,likePostHandler,unLikePostHandler,closeModal,likeCount,commentCount,getPostFetching,isUserProfilePost,isAuthUserPost,postDataError}) => {

    useEffect(() => {
        if(isCommentModal){
            document.body.style.overflow = 'hidden'
        } else document.body.style.overflow = ''
    },[isCommentModal])

    const com = useRef(null)

    return (
        <ModalWrapper closeModal={closeModal} modalWrapCenter={false} style={{'width':'550px'}} isModalOpen={isCommentModal}>
            {
                !getPostFetching ? post &&
                    <div>
                        <div className={classes.post}>
                            <Link to={`/users/${post.userHandle}`}>
                                    <div style={{'background': `url(${post.userImage}) center / cover no-repeat`}} className={classes.photo}/>
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
                        <CommentForm postId={post.postId} isUserProfilePost={isUserProfilePost} comRef={com}/>
                        <div ref={com} className={classes.comments}>
                            {
                                post.comments.slice().reverse().map(comment => {
                                    return <Comment
                                        key={comment.createdAt}
                                        comment={comment}
                                    />
                                })
                            }
                        </div >
                    </div>
                    : <Preloader />
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
                                    isAuthUserPost={isAuthUserPost}
                                />
                                <div onClick={closeCommentModal} className={classes.closeButton}>
                                    <FontAwesomeIcon className={classes.closeIcon} icon={faTimes} color='rgba(0,160,202,.8)'/>
                                </div>
                            </div>
                            <CommentForm postId={post.postId} isUserProfilePost={isUserProfilePost}/>
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

export default connect(mapStateToProps)(CommentModal)