import formClasses from "../../cssCommonModules/forms/Form.module.scss" 
import btn from "../../cssCommonModules/buttons/buttons.module.scss" 
import React, {useState} from "react" 
import {connect} from "react-redux" 
import {Preloader} from "../Preloader/Preloaders" 
import {addUserDetails} from "../../store/profileReducer" 
import ModalWrapper from "./ModalWrapper"
import InputErrorBlock from "../common/InputErrorBlock";

const EditProfileModal = ({setShowModal,addUserDetails,isFetching}) => {
    const[bio,setBio] = useState('')
    const[location,setLocation] = useState('')
    const[isbBioMaxLength,setIsBioMaxLength] = useState(false)
    const[isLocMaxLength,setIsLocMaxLength] = useState(false)
    const maxLengthForBio = 200 
    const maxLengthForLocation = 30

    const submitHandler = e => {
        e.preventDefault()
        if(bio.trim().length < maxLengthForBio && location.trim().length < maxLengthForLocation){
            setIsBioMaxLength(false)
            addUserDetails(bio,location).then(() => {
                setShowModal(false)
            })
        } else if(bio.trim().length > maxLengthForBio) {
            setIsBioMaxLength(true)
        } else if(location.trim().length > maxLengthForLocation) {
            setIsBioMaxLength(false)
            setIsLocMaxLength(true)
        }
    }

    return (
        <ModalWrapper closeModal={setShowModal}>
                <h5>Here you can edit your bio and location</h5>
                <form onSubmit={submitHandler}>
                    <div className={isbBioMaxLength ? `${formClasses.field} ${formClasses.inputError}`  :`${formClasses.field} ${formClasses.fieldBGColor}`} style={{'marginTop': '20px'}}>
                        <input value={bio} onChange={e => {setBio(e.target.value)}} type="text" required id="bio"/>
                        <label htmlFor="bio" title="bio" data-title="bio"/>
                        <InputErrorBlock isError={isbBioMaxLength} errorClass={formClasses.emailErrorMessage} errorMessage={`the maximum number of characters is ${maxLengthForBio}`}/>
                    </div>
                    <div className={isLocMaxLength ? `${formClasses.field} ${formClasses.inputError}` :`${formClasses.field} ${formClasses.fieldBGColor}`} style={{'marginTop': '20px'}}>
                        <input value={location} onChange={e => {setLocation(e.target.value)}} type="text" required id="location"/>
                        <label htmlFor="location" title="location" data-title="location"/>
                        <InputErrorBlock isError={isLocMaxLength} errorClass={formClasses.emailErrorMessage} errorMessage={`the maximum number of characters is ${maxLengthForLocation}`}/>
                    </div>
                    { isFetching && <Preloader/> }
                    <button disabled={isFetching} type="submit" className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Edit</button>
                    <button disabled={isFetching} type="button" onClick={() => {setShowModal(false)}} className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Close</button>
                </form>
        </ModalWrapper>
    )
}

const mapStateToProps = state => ({
    isFetching: state.profilePage.isFormFetching
})

export default connect(mapStateToProps,{addUserDetails})(EditProfileModal)