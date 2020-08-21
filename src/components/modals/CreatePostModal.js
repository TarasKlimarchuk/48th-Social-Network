import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import btn from "../../cssCommonModules/buttons.module.scss"
import { addNewPost } from "../../store/homeReducer"
import ModalWrapper from "./ModalWrapper"
import CredErrorBlock from "../common/CredErrorBlock/CredErrorBlock"
import InputBox from "../common/InputBox/InputBox"
import { Preloader } from "../common/Preloader/Preloaders"

const CreatePostModal = ({addNewPost,setCreatePostModalOpen,isFormFetching,createPostModalOpen,addNewPostError}) => {
    const[post,setPost] = useState('')

    const submitHandler = e => {
        e.preventDefault()
        addNewPost(post)
    }

    useEffect(() => {
        if(!isFormFetching){
            setPost('')
        }
    },[isFormFetching])

    const closeModal = () => {
        setCreatePostModalOpen(false)
        setPost('')
    }

    return (
        <ModalWrapper closeModal={closeModal} isModalOpen={createPostModalOpen}>
            <h5>Add a new Post</h5>
            <form onSubmit={submitHandler}>
                <CredErrorBlock errorMessage={addNewPostError}/>
                <InputBox value={post} setValue={setPost} label={'Post'} isError={addNewPostError}/>
                { isFormFetching && <Preloader/>}
                <button disabled={isFormFetching} type="submit" className={btn.btnSubmit} style={{marginLeft:'10px',marginTop: '30px'}}>Create</button>
                <button disabled={isFormFetching} type="button" onClick={closeModal} className={btn.btnSubmit} style={{marginLeft:'10px',marginTop: '30px'}}>Close</button>
            </form>
        </ModalWrapper>
    )
}

const mapStateToProps = state => ({
    isFormFetching: state.homePage.isFormFetching,
    createPostModalOpen: state.homePage.createPostModalOpen,
    addNewPostError: state.homePage.addNewPostError
})

export default connect(mapStateToProps,{addNewPost})(CreatePostModal)