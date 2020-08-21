import React from "react";
import classes from "./PostContent.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComments as Comment, faHeart as Heart } from "@fortawesome/free-regular-svg-icons";

const PostActions = ({isPostLiked,likePostHandler,unLikePostHandler,likeCount,openCommentModal,commentCount}) => {
    return (
        <div className={classes.actions}>
            {
                isPostLiked
                    ? <div className={classes.likes}>
                        <FontAwesomeIcon  onClick={unLikePostHandler} icon={faHeart} size="lg"  color='rgb(0,160,202)'/>
                        { likeCount === 1 && <small onClick={unLikePostHandler} className={classes.iconText}>{'1 like'}</small> }
                        { likeCount > 1 && <small onClick={unLikePostHandler} className={classes.iconText}>{likeCount + ' likes'}</small> }
                    </div>

                    : <div onClick={likePostHandler} className={classes.likes}>
                        <FontAwesomeIcon icon={Heart} size="lg"  color='rgb(0,160,202)'/>
                        { likeCount === 1 && <small onClick={likePostHandler} className={classes.iconText}>{'1 like'}</small> }
                        { likeCount > 1 && <small onClick={likePostHandler} className={classes.iconText}>{likeCount + ' likes'}</small> }
                    </div>
            }
            {
                openCommentModal ? <div  onClick={openCommentModal} className={classes.comments}>
                        <FontAwesomeIcon icon={Comment} size="lg" color='rgb(0,160,202)'/>
                        {commentCount === 1 && <small className={classes.iconText}>1 comment</small>}
                        {commentCount > 1 && <small className={classes.iconText}>{commentCount + ' comments'}</small>}
                    </div>
                    : <div className={classes.comments} style={{'cursor':'auto'}}>
                        <FontAwesomeIcon icon={faComment} size="lg" color='rgb(0,160,202)'/>
                        {commentCount === 1 && <small className={classes.iconText}>1 comment</small>}
                        {commentCount > 1 && <small className={classes.iconText}>{commentCount + ' comments'}</small>}
                    </div>
            }
        </div>
    )
}

export default PostActions