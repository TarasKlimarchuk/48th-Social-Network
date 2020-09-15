import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import btn from "../../cssCommonModules/buttons.module.scss"
import {addNewPost, setAddNewPostError} from "../../store/homeReducer"
import ModalWrapper from "./ModalWrapper"
import CredErrorBlock from "../common/CredErrorBlock/CredErrorBlock"
import { Preloader } from "../common/Preloader/Preloaders"

const CreatePostModal = ({addNewPost,setCreatePostModalOpen,isFormFetching,createPostModalOpen,addNewPostError,setAddNewPostError}) => {
    const[post,setPost] = useState('')

    useEffect(() => {
        if(post.trim().length > 0){
            setAddNewPostError(null)
        }
    },[post])

    useEffect(() => {
        if(!isFormFetching){
            setPost('')
        }
    },[isFormFetching])

    const submitHandler = e => {
        e.preventDefault()
        addNewPost(post)
    }

    const closeModal = () => {
        setCreatePostModalOpen(false)
        setPost('')
    }

    const textareaStyle = {
        width: '100%',
        border: '3px solid $border-grey',
        borderRadius: '4px',
        marginTop: '6px',
        marginBottom: '10px',
        padding: '5px 10px',
        fontSize: '18px',
        resize: 'none',
        outline: 'none'
    }

    return (
        <ModalWrapper closeModal={closeModal} isModalOpen={createPostModalOpen}>
            <h5>Add a new Post</h5>
            <form onSubmit={submitHandler}>
                <CredErrorBlock errorMessage={addNewPostError}/>
                <textarea style={textareaStyle} value={post} onChange={(e) => {setPost(e.target.value)}}/>
                { isFormFetching && <Preloader/>}
                <button disabled={isFormFetching} type="submit" className={btn.btnSubmit} style={{marginLeft:'10px',marginTop: '30px'}}>Create</button>
                <button disabled={isFormFetching} type="button" onClick={closeModal} className={btn.btnSubmit} style={{marginLeft:'10px',marginTop: '30px'}}>Close</button>
            </form>
        </ModalWrapper>
    )
}
//<InputBox value={post} setValue={setPost} label={'Post'} isError={addNewPostError}/>
const mapStateToProps = state => ({
    isFormFetching: state.homePage.isFormFetching,
    createPostModalOpen: state.homePage.createPostModalOpen,
    addNewPostError: state.homePage.addNewPostError
})

export default connect(mapStateToProps,{addNewPost,setAddNewPostError})(CreatePostModal)