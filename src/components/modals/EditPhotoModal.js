import React, { useState } from "react"
import { connect } from "react-redux"
import { app } from '../../FBconfig/config'
import btn from "../../cssCommonModules/buttons.module.scss"
import { Preloader } from "../common/Preloader/Preloaders"
import { editPhoto, setFormFetching } from "../../store/profileReducer"
import ModalWrapper from "./ModalWrapper"
import CredErrorBlock from "../common/CredErrorBlock/CredErrorBlock"

const EditPhotoModal = ({setEditPhotoModal,handle,editPhoto,isFetching,setFormFetching,editPhotoModal}) => {
    const[file,setFile] = useState(null)
    const[fileTypeError,setFileTypeError] = useState(false)

    const onFileChange =  e => {
        setFileTypeError(false)
        const file = e.target.files[0]
        setFile(file)
    }

    const submitHandler = async e => {
        e.preventDefault()
        if(file.type.split('/')[1] === 'png' || file.type.split('/')[1] === 'jpeg'){
            setFormFetching(true)
            const storageRef = app.storage().ref()
            const fileRef = storageRef.child(file.name)
            await fileRef.put(file)
            await fileRef.getDownloadURL()
            editPhoto(await fileRef.getDownloadURL(),handle)
        } else {
            setFileTypeError(true)
        }
    }

    const closeModal = () => {
        setEditPhotoModal(false)
    }

    return (
        <ModalWrapper closeModal={setEditPhotoModal} isModalOpen={editPhotoModal}>
                <h5>Here you can add or change your photo</h5>
                <form onSubmit={submitHandler}>
                    <div>
                        <CredErrorBlock errorMessage={fileTypeError && `Invalid type of the file, must be png or jpeg`}/>
                        <input type="file" onChange={onFileChange} style={{marginTop:'10px'}}/>
                    </div>
                    {isFetching && <Preloader/>}
                    <button disabled={isFetching} type="submit" className={btn.btnSubmit} style={{marginLeft:'10px',marginTop: '30px'}}>Edit</button>
                    <button disabled={isFetching} type="button" onClick={closeModal} className={btn.btnSubmit} style={{marginLeft:'10px',marginTop: '30px'}}>Close</button>
                </form>
        </ModalWrapper>
    )
}

const mapStateToProps = state => ({
    isFetching: state.profilePage.isFormFetching,
    editPhotoModal: state.profilePage.editPhotoModal
})

export default connect(mapStateToProps,{editPhoto,setFormFetching})(EditPhotoModal)