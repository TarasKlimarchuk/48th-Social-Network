import React, {useRef, useState} from "react"
import classes from "./Comment.module.scss" 
import moment from "moment" 
import {Link} from "react-router-dom" 
import {connect} from "react-redux" 

const Comment = ({comment}) => {

    const com = useRef(null)

    return (
        <div className={classes.comment}>
            <Link to={`/users/${comment.userHandle}`} style={{'background': `url(${comment.userImage}) center / cover no-repeat`}} className={classes.photo}/>
            <div className={classes.content}>
                <Link to={`/users/${comment.userHandle}`} style={{'display':'block','textDecoration':'none'}}><div className={classes.handle}>{comment.userHandle}</div></Link>
                <small className={classes.createdAt}>{moment(comment.createdAt).calendar()}</small>
                <div className={classes.body}>{comment.body}</div>
            </div>
        </div>
    )
}

export default Comment