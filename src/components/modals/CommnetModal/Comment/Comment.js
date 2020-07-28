import React, {useState} from "react";
import classes from "./Comment.module.scss";
import moment from "moment";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

const Comment = ({comment,userData}) => {

    const[isAuthUserPost,setIsAuthUserPost] = useState(false)
    if(userData && userData.credentials.handle === comment.userHandle && !isAuthUserPost){
        setIsAuthUserPost(true)
    }

    return (
        <div className={classes.comment}>
            {
                !isAuthUserPost ? <Link to={`/users/${comment.userHandle}`} style={{'background': `url(${comment.userImage}) center / cover no-repeat`}} className={classes.photo}/>
            : <div style={{'background': `url(${comment.userImage}) center / cover no-repeat`}} className={classes.photo}/>
            }
            <div className={classes.content}>
                {
                    !isAuthUserPost ? <Link to={`/users/${comment.userHandle}`} style={{'display':'block','textDecoration':'none'}}><div className={classes.handle}>{comment.userHandle}</div></Link>
                        : <div className={classes.handle}>{comment.userHandle}</div>
                }
                <small className={classes.createdAt}>{moment(comment.createdAt).calendar()}</small>
                <div className={classes.body}>{comment.body}</div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.profilePage.userData
})

export default connect(mapStateToProps,{})(Comment)