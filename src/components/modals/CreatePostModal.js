import formClasses from "../../cssCommonModules/forms/Form.module.scss"
import btn from "../../cssCommonModules/buttons/buttons.module.scss" 
import React, { useState } from "react" 
import {connect} from "react-redux" 
import {addNewPost} from "../../store/homeReducer" 
import {Preloader} from "../Preloader/Preloaders" 
import ModalWrapper from "./ModalWrapper"
import InputErrorBlock from "../common/InputErrorBlock";

const CreatePostModal = ({addNewPost,setCreatePostModal,isFetching}) => {
    const[post,setPost] = useState('')
    const[isMaxLength,setIsMaxLength] = useState(false)
    const[isMinLength,setIsMinLength] = useState(false)
    const postMaxLength = 230
    const postMinLength = 5

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

    return (
        <ModalWrapper closeModal={setCreatePostModal}>
                <h5>Add a new Post</h5>
                <form onSubmit={submitHandler}>
                    <div className={isMaxLength || isMinLength ? `${formClasses.field} ${formClasses.inputError}`  :`${formClasses.field} ${formClasses.fieldBGColor}`} style={{'marginTop': '20px'}}>
                        <input value={post} onChange={e => {setPost(e.target.value)}} type="text" required id="post"/>
                        <label htmlFor="post" title="post" data-title="post"/>
                        <InputErrorBlock isError={isMinLength} errorClass={formClasses.emailErrorMessage} errorMessage={`the minimum number of characters is ${postMinLength}`}/>
                        <InputErrorBlock isError={isMaxLength} errorClass={formClasses.emailErrorMessage} errorMessage={`the maximum number of characters is ${postMaxLength}`}/>
                    </div>
                    { isFetching && <Preloader/>}
                    <button disabled={isFetching} type="submit" className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Create</button>
                    <button disabled={isFetching} type="button" onClick={() => {setCreatePostModal(false)}} className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Close</button>
                </form>
        </ModalWrapper>
    )
}

const mapStateToProps = state => ({
    isFetching: state.homePage.isFormFetching
})

export default connect(mapStateToProps,{addNewPost})(CreatePostModal)