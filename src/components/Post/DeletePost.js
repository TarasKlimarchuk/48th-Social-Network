import React, { useState } from "react"
import { connect } from "react-redux"
import classes from "./Post.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons"
import { deletePost } from "../../store/homeReducer"
import DeleteModal from "../modals/DeleteModal"

const DeletePost = ({isAuthUserPost,deletedPost,deletePost}) => {
    const[deletePostModal,setDeletePostModal] = useState(false)

    const removePost = () => {
        deletePost(deletedPost)
    }

    return (
        <div>
            {
                isAuthUserPost && <div onClick={() => {setDeletePostModal(true)}} className={classes.basket}>
                    <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </div>
            }
            {
                deletePostModal && <DeleteModal
                    deleteItem={removePost}
                    setDeletePostModal={setDeletePostModal}
                    title={'Are you sure you want to delete this Post?'}
                    isModalOpen={deletePostModal}
                />
            }
        </div>
    )
}

export default connect(null,{deletePost})(DeletePost)