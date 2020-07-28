import React, {useState} from "react" 
import classes from "./Post.module.scss" 
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome" 
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons" 
import DeletePostModal from "../modals/DeletePostModal" 

const DeletePost = ({isAuthUserPost,deletedPost}) => {
    const[deletePostModal,setDeletePostModal] = useState(false)

    return (
        <div>
            {
                isAuthUserPost && <div onClick={() => {setDeletePostModal(true)}} className={classes.basket}>
                    <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </div>
            }
            {
                deletePostModal && <DeletePostModal setDeletePostModal={setDeletePostModal} postId={deletedPost}/>
            }
        </div>
    )
}

export default DeletePost