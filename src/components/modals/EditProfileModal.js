import classes from "../../../cssModules/modal/Modal.module.scss";
import formClasses from "../../../cssModules/forms/Form.module.scss";
import btn from "../../../cssModules/buttons/buttons.module.scss";
import React, {useState} from "react";
import {connect} from "react-redux";
import {Preloader} from "../../Preloader/Preloaders";
import {addUserDetails} from "../../../store/profileReducer";

const EditProfileModal = ({setShowModal,addUserDetails,isFetching}) => {
    const[bio,setBio] = useState('')
    const[location,setLocation] = useState('')
    const[isbBioMaxLength,setIsBioMaxLength] = useState(false)
    const[isLocMaxLength,setIsLocMaxLength] = useState(false)
    const maxLengthForBio = 200;
    const maxLengthForLocation = 30

    const submitHandler = e => {
        e.preventDefault()
        if(bio.length < maxLengthForBio && location.length < maxLengthForLocation){
            setIsBioMaxLength(false)
            addUserDetails(bio,location).then(() => {
                setShowModal(false)
            })
        } else if(bio.length > maxLengthForBio) {
            setIsBioMaxLength(true)
        } else if(location.length > maxLengthForLocation) {
            setIsBioMaxLength(false)
            setIsLocMaxLength(true)
        }

    }
    return (
        <div className={classes.modalWrapCenter}>
            <div className={classes.modal}>
                <h5>Here you can edit your bio and location</h5>
                <form onSubmit={submitHandler}>
                    <div className={isbBioMaxLength ? `${formClasses.field} ${formClasses.inputError}`  :`${formClasses.field} ${formClasses.fieldBGColor}`} style={{'marginTop': '20px'}}>
                        <input value={bio} onChange={e => {setBio(e.target.value)}} type="text" required id="bio"/>
                        <label htmlFor="bio" title="Bio" data-title="Bio"/>
                        {isbBioMaxLength && <div className={formClasses.emailErrorMessage}>the maximum number of characters is {maxLengthForBio}</div>}
                    </div>
                    <div className={isLocMaxLength ? `${formClasses.field} ${formClasses.inputError}` :`${formClasses.field} ${formClasses.fieldBGColor}`} style={{'marginTop': '20px'}}>
                        <input value={location} onChange={e => {setLocation(e.target.value)}} type="text" required id="location"/>
                        <label htmlFor="location" title="Location" data-title="Location"/>
                        {isLocMaxLength && <div className={formClasses.emailErrorMessage}>the maximum number of characters is {maxLengthForLocation}</div>}
                    </div>
                    { isFetching && <Preloader/> }
                    <button disabled={isFetching} type="submit" className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Edit</button>
                    <button disabled={isFetching} type="button" onClick={() => {setShowModal(false)}} className={btn.btnSubmit} style={{ 'marginLeft':'10px','marginTop': '30px'}}>Close</button>
                </form>
            </div>
        </div>

    )
}

const mapStateToProps = state => ({
    isFetching: state.profilePage.isFormFetching
})

export default connect(mapStateToProps,{addUserDetails})(EditProfileModal)