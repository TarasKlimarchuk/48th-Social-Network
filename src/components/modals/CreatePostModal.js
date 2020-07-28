import classes from "../../../cssModules/modal/Modal.module.scss";
import formClasses from "../../../cssModules/forms/Form.module.scss";
import btn from "../../../cssModules/buttons/buttons.module.scss";
import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {addNewPost} from "../../../store/homeReducer";
import {Preloader} from "../../Preloader/Preloaders";

const CreatePostModal = ({addNewPost,setCreatePostModal,isFetching}) => {
    const[post,setPost] = useState('')
    const[isMaxLength,setIsMaxLength] = useState(false)
    const[isMinLength,setIsMinLength] = useState(false)
    const postMaxLength = 230
    const postMinLength = 5

    const modalWrap = useRef()
    const handleClickOutside = e => {
        if(e.target === modalWrap.current){
            setCreatePostModal(false)
        }
    }

    const submitHandler = e => {
        e.preventDefault()
        if(post.trim().length < postMinLength){
            setIsMinLength(true)
        } else if(post.trim().length < postMaxLength){
            addNewPost(post).then(() => {
                setCreatePostModal(false)
            })
        } else {
            setIsMaxLength(true)
        }
    }

    //TODO use onMouseLeave for notifications
    //TODO Modal wrapper for all modalDialogs
    return (
        <div className={classes.modalWrap} onClick={handleClickOutside} ref={modalWrap}>
            <div className={classes.modal}>
                <h5>Add a new Post</h5>
                <form onSubmit={submitHandler}>
                    <div className={isMaxLength || isMinLength ? `${formClasses.field} ${formClasses.inputError}`  :`${formClasses.field} ${formClasses.fieldBGColor}`} style={{'marginTop': '20px'}}>
                        <input value={post} onChange={e => {setPost(e.target.value)}} type="text" required id="post"/>
                        <label htmlFor="post" title="Post" data-title="post"/>
                        {isMinLength && <div className={formClasses.emailErrorMessage}>the minimum number of characters is {postMinLength}</div>}
                        {isMaxLength && <div className={formClasses.emailErrorMessage}>the maximum number of characters is {postMaxLength}</div>}
                    </div>
                    { isFetching && <Preloader/>}
                    <button disabled={isFetching} type="submit" className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Create</button>
                    <button disabled={isFetching} type="button" onClick={() => {setCreatePostModal(false)}} className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Close</button>
                </form>
            </div>
        </div>

    )
}

const mapStateToProps = state => ({
    isFetching: state.homePage.isFormFetching
})

export default connect(mapStateToProps,{addNewPost})(CreatePostModal)