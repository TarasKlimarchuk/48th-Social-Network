import classes from './CommentModal.module.scss'
import React from "react" 
import {connect} from "react-redux" 
import {Preloader} from "../../Preloader/Preloaders" 
import PostContent from "../../Post/PostContent/PostContent" 
import Comment from "./Comment/Comment" 
import { faTimes } from "@fortawesome/free-solid-svg-icons" 
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome" 
import {Link} from "react-router-dom" 
import ModalWrapper from "../ModalWrapper" 
import CommentForm from "./CommentForm/CommentForm" 

const CommentModal = ({post,isPostLiked,likePostHandler,unLikePostHandler,closeCommentModal,likeCount,commentCount,isFetching,isUserProfilePost,isAuthUserPost,postDataError}) => {

    if(!postDataError){
        return (
            <ModalWrapper closeModal={closeCommentModal} modalWrapCenter={false} style={{'width':'550px'}}>
                {
                    !isFetching && post ?
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
            <ModalWrapper closeModal={closeCommentModal} modalWrapCenter={false} style={{'width':'550px'}}>
                Something went wrong, please try again
            </ModalWrapper>
        )
}

const mapStateToProps = state => ({
    post: state.postPage.post,
    postDataError: state.postPage.postDataError,
    isFetching: state.postPage.getPostFetching
})

export default connect(mapStateToProps)(CommentModal)