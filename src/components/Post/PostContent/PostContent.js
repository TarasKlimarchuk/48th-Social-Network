import React from "react"
import moment from "moment"
import classes from "./PostContent.module.scss"
import { Link } from "react-router-dom"
import PostActions from "./PostActions"

const  PostContent = ({post,isPostLiked,likePostHandler,unLikePostHandler,openCommentModal = false, likeCount,commentCount}) => {
    return (
        <div className={classes.content}>
            <div className={classes.handle}><Link to={`/users/${post.userHandle}`}>{post.userHandle}</Link></div>
            <small className={classes.createdAt}>{moment(post.createdAt).calendar()}</small>
            <div className={classes.body}>{post.body}</div>
            <PostActions
                commentCount={commentCount}
                likeCount={likeCount}
                isPostLiked={isPostLiked}
                likePostHandler={likePostHandler}
                unLikePostHandler={unLikePostHandler}
                openCommentModal={openCommentModal}
            />
        </div>
    )
}

export default PostContent