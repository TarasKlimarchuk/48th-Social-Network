import React, { useState } from "react"
import { connect } from "react-redux"
import classes from "./Comment.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons"
import { deleteComment } from "../../../../store/fullPostReducer"
import DeleteModal from "../../DeleteModal"

const DeletePost = ({isAuthUserPost,deletedComment,deleteComment,postId}) => {
    const[deleteCommentModal,setDeleteCommentModal] = useState(false)

    const removeComment = () => {
        deleteComment(postId,deletedComment)
    }

    return (
        <div>
            {
                isAuthUserPost && <div onClick={setDeleteCommentModal} className={classes.basket}>
                    <FontAwesomeIcon icon={faTrashAlt}/>
                </div>
            }
            {
                deleteCommentModal && <DeleteModal
                    deleteItem={removeComment}
                    setDeletePostModal={setDeleteCommentModal}
                    title={'Are you sure you want to delete this Comment?'}
                    isModalOpen={deleteCommentModal}
                />
            }
        </div>
    )
}

export default connect(null,{deleteComment})(DeletePost)