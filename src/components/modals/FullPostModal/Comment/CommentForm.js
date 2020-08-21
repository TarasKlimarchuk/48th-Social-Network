import formClasses from "../../../../cssCommonModules/Form.module.scss"
import {Preloader} from "../../../common/Preloader/Preloaders"
import btn from "../../../../cssCommonModules/buttons.module.scss"
import React, {useEffect, useState} from "react"
import {connect} from "react-redux" 
import {sendComment} from "../../../../store/fullPostReducer" 
import {sendCommentToUserProfile} from "../../../../store/usersReducer"
import InputBox from "../../../common/InputBox/InputBox";
import CredErrorBlock from "../../../common/CredErrorBlock/CredErrorBlock";

const CommentForm = ({sendComment,commentError,postId,isFormFetching,isUserProfilePost,sendCommentToUserProfile}) => {
    const[comment,setComment] = useState('')

    useEffect(()=>{
        if(!isFormFetching && !commentError){
            setComment('')
        }
    },[isFormFetching])

    const submitHandler = e => {
        e.preventDefault()
        isUserProfilePost ? sendCommentToUserProfile(postId,comment) : sendComment(postId,comment)
    }

    return (
        <form onSubmit={submitHandler}>
            <CredErrorBlock errorMessage={commentError}/>
            <InputBox value={comment} setValue={setComment} label={'Your comment'} isError={commentError}/>
            <button disabled={isFormFetching} type="submit" className={btn.btnSubmit} >Send</button>
        </form>
    )
}

const mapStateToProps = state => ({
    commentError: state.postPage.commentError,
    isFormFetching: state.postPage.isFormFetching
})

export default connect(mapStateToProps,{sendComment,sendCommentToUserProfile})(CommentForm)