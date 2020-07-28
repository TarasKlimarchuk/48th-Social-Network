import formClasses from "../../../../cssCommonModules/forms/Form.module.scss" 
import {Preloader} from "../../../Preloader/Preloaders" 
import btn from "../../../../cssCommonModules/buttons/buttons.module.scss" 
import React, {useState} from "react" 
import {connect} from "react-redux" 
import {sendComment} from "../../../../store/fullPostReducer" 
import {sendCommentToUserProfile} from "../../../../store/usersReducer"
import InputErrorBlock from "../../../common/InputErrorBlock";

const CommentForm = ({sendComment,postId,isFetching,isUserProfilePost,sendCommentToUserProfile}) => {
    const[comment,setComment] = useState('')
    const[isMaxLength,setIsMaxLength] = useState(false)
    const commentMaxLength = 230

    const submitHandler = e => {
        e.preventDefault()
        if(comment.trim().length > commentMaxLength) setIsMaxLength(true)
        isUserProfilePost ? sendCommentToUserProfile(postId,comment) : sendComment(postId,comment)
    }

    return (
        <form onSubmit={submitHandler}>
            <div className={isMaxLength ? `${formClasses.field} ${formClasses.inputError}`  :`${formClasses.field} ${formClasses.fieldBGColor}`} style={{'marginTop': '20px'}}>
                <input value={comment} onChange={(e) => {setComment(e.target.value)}} type="text" required id="comment"/>
                <label htmlFor="comment" title="comment" data-title="comment"/>
                <InputErrorBlock isError={isMaxLength} errorClass={formClasses.emailErrorMessage} errorMessage={`the maximum number of characters is ${commentMaxLength}`}/>
            </div>
            { isFetching && <Preloader/>}
            <button disabled={isFetching} type="submit" className={btn.btnSubmit} >Send</button>
        </form>
    )
}

const mapStateToProps = state => ({
    isFetching: state.postPage.formIsFetching
})

export default connect(mapStateToProps,{sendComment,sendCommentToUserProfile})(CommentForm)