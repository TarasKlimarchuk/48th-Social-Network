import React from "react";
import classes from "../../../cssModules/modal/Modal.module.scss";
import btn from "../../../cssModules/buttons/buttons.module.scss";
import {connect} from "react-redux";
import { deletePost } from "../../../store/homeReducer";

const DeletePostModal = ({deletePost,postId,setDeletePostModal}) => {

    const removePost = () => {
        deletePost(postId).then(() => {
            setDeletePostModal(true)
        })
    }

    return (
        <div className={classes.modalWrapCenter}>
            <div className={classes.modal}>
                <h4>Are you sure you want to delete this Post?</h4>
                <button onClick={removePost} className={btn.btnRed} style={{'marginLeft':'120px','marginTop':'30px'}}>Delete</button>
                <button onClick={() => {setDeletePostModal(false)}} className={btn.btnSubmit} style={{'marginLeft':'10px','marginTop':'30px'}}>Cancel</button>
            </div>
        </div>
    )
}

export default connect(null,{deletePost})(DeletePostModal)