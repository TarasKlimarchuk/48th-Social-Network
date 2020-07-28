import React from "react" 
import btn from "../../cssCommonModules/buttons/buttons.module.scss" 
import {connect} from "react-redux" 
import { deletePost } from "../../store/homeReducer" 
import ModalWrapper from "./ModalWrapper" 

const DeletePostModal = ({deletePost,postId,setDeletePostModal}) => {

    const removePost = () => {
        deletePost(postId).then(() => {
            setDeletePostModal(false)
        })
    }

    return (
        <ModalWrapper closeModal={setDeletePostModal}>
            <h4>Are you sure you want to delete this Post?</h4>
            <button onClick={removePost} type="button" className={btn.btnRed} style={{'marginLeft':'120px','marginTop':'30px'}}>Delete</button>
            <button onClick={() => {setDeletePostModal(false)}} type="button" className={btn.btnSubmit} style={{'marginLeft':'10px','marginTop':'30px'}}>Cancel</button>
         </ModalWrapper>
    )
}

export default connect(null,{deletePost})(DeletePostModal)