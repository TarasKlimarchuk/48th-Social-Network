import formClasses from "../../cssCommonModules/forms/Form.module.scss" 
import btn from "../../cssCommonModules/buttons/buttons.module.scss" 
import React, {useState} from "react" 
import {connect} from "react-redux" 
import {Preloader} from "../Preloader/Preloaders" 
import { app } from '../../FBconfig/config'
import {editPhoto} from "../../store/profileReducer" 
import ModalWrapper from "./ModalWrapper"
import InputErrorBlock from "../common/InputErrorBlock";

const EditPhotoModal = ({setEditPhotoModal,handle,editPhoto,isFetching}) => {
    const[imageUrl,setImageUrl] = useState(null)
    const[fileTypeError,setFileTypeError] = useState(false)

    const onFileChange = async e => {
        const file = e.target.files[0]
        if(file.type.split('/')[1] === 'png' || file.type.split('/')[1] === 'jpeg'){
            const storageRef = app.storage().ref()
            const fileRef = storageRef.child(file.name)
            await fileRef.put(file)
            setImageUrl(await fileRef.getDownloadURL())
        } else {
            setFileTypeError(true)
        }
    }

    const submitHandler = e => {
        e.preventDefault()
        if(!fileTypeError){
            editPhoto(imageUrl,handle).then(() => {
                setEditPhotoModal(false)
            })
        }
    }
    return (
        <ModalWrapper closeModal={setEditPhotoModal}>
                <h5>Here you can add or change your photo</h5>
                <form onSubmit={submitHandler}>
                    <div>
                        <input type="file" onChange={onFileChange} style={{'marginTop':'10px'}}/>
                        <InputErrorBlock isError={fileTypeError} errorClass={formClasses.invalidDataError} errorMessage={`Invalid type of the file, must be png or jpeg`} />
                    </div>
                    { isFetching && <Preloader/>}
                    <button disabled={isFetching} type="submit" className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Edit</button>
                    <button disabled={isFetching} type="button" onClick={() => {setEditPhotoModal(false)}} className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Close</button>
                </form>
        </ModalWrapper>
    )
}

const mapStateToProps = state => ({
    isFetching: state.profilePage.isFormFetching
})

export default connect(mapStateToProps,{editPhoto})(EditPhotoModal)