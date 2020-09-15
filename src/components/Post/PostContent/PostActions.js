import React from "react";
import classes from "./PostContent.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComments as Comment, faHeart as Heart } from "@fortawesome/free-regular-svg-icons";

const PostActions = ({isPostLiked,likePost,unLikePost,likeCount,openCommentModal,commentCount}) => {

    const likeCountMarkup = likeCount === 1 ? <small className={classes.iconText}>{'1 like'}</small>
        : likeCount > 1 ? <small className={classes.iconText}>{likeCount + ' likes'}</small> : null

    const commentCountMarkup = commentCount === 1 ? <small className={classes.iconText}>1 comment</small>
        : commentCount > 1 ? <small className={classes.iconText}>{commentCount + ' comments'}</small> : null
    
    return (
        <div className={classes.actions}>
            {
                isPostLiked
                    ? <div className={classes.likes} onClick={unLikePost}>
                        <FontAwesomeIcon  icon={faHeart} size="lg"  color='rgb(0,160,202)'/>
                        { likeCountMarkup }
                    </div>

                    : <div onClick={likePost} className={classes.likes}>
                        <FontAwesomeIcon icon={Heart} size="lg"  color='rgb(0,160,202)'/>
                        { likeCountMarkup }
                    </div>
            }
            {
                openCommentModal ? <div  onClick={openCommentModal} className={classes.comments}>
                        <FontAwesomeIcon icon={Comment} size="lg" color='rgb(0,160,202)'/>
                        { commentCountMarkup }
                    </div>
                    : <div className={classes.comments} style={{'cursor':'auto'}}>
                        <FontAwesomeIcon icon={faComment} size="lg" color='rgb(0,160,202)'/>
                        { commentCountMarkup }
                    </div>
            }
        </div>
    )
}

export default PostActions