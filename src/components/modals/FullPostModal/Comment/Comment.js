import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import moment from "moment"
import classes from "./Comment.module.scss"
import DeleteComment from "./DeleteComment"

const Comment = ({comment,isFormFetching,authUserHandle,postId}) => {

    const[isAuthUserComment, setIsAuthUserComment] = useState(false)

    useEffect(() => {
        if(authUserHandle === comment.userHandle){
            setIsAuthUserComment(true)
        } else {
            setIsAuthUserComment(false)
        }
    },[authUserHandle,comment])

    return (
        <div className={comment.isAnimation === true ? classes.commentWithAnimations : classes.comment}>
            <Link to={`/users/${comment.userHandle}`} style={{background: `rgba(0,0,0,.4) url(${comment.userImage}) center / cover no-repeat`}} className={classes.photo}/>
            <div className={classes.content}>
                <div className={classes.handle}>
                    <Link to={`/users/${comment.userHandle}`}>{comment.userHandle}</Link>
                </div>
                <small className={classes.createdAt}>{moment(comment.createdAt).calendar()}</small>
                <div className={classes.body}>{comment.body}</div>
            </div>
            <DeleteComment
                isAuthUserPost={isAuthUserComment}
                deletedComment={comment.commentId}
                isFormFetching={isFormFetching}
                postId={postId}
            />
        </div>
    )
}

const mapStateToProps = state => ({
    authUserHandle: state.profilePage.credentials.handle,
    isFormFetching: state.postPage.isFormFetching
})


export default connect(mapStateToProps)(Comment)