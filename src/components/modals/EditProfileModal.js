import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import btn from "../../cssCommonModules/buttons.module.scss"
import { addUserDetails } from "../../store/profileReducer"
import ModalWrapper from "./ModalWrapper"
import InputBox from "../common/InputBox/InputBox"
import CredErrorBlock from "../common/CredErrorBlock/CredErrorBlock"

const EditProfileModal = ({setShowModal,addUserDetails,isFormFetching,editProfileModal,addUserDetailsError}) => {
    const [bio, setBio] = useState('')
    const [isBioError, setBioError] = useState(false)
    const [isLocationError, setLocationError] = useState(false)
    const [location, setLocation] = useState('')

    useEffect(() => {
        if( addUserDetailsError && addUserDetailsError.indexOf('biography') !== -1){
            setBioError(true)
            setLocationError(false)
        } else if(addUserDetailsError && addUserDetailsError.indexOf('location') !== -1){
            setLocationError(true)
            setBioError(false)
        }  else {
            setBioError(false)
            setLocationError(false)
        }
        },[addUserDetailsError])

    const submitHandler = e => {
        e.preventDefault()
        addUserDetails(bio, location)
    }

    const closeModal = () => {
        setBio('')
        setLocation('')
        setShowModal(false)
    }

    return (
        <ModalWrapper closeModal={closeModal} isModalOpen={editProfileModal}>
            <h5 style={{marginBottom: '20px'}} >Here you can edit your bio and location</h5>
            <form onSubmit={submitHandler}>
                <CredErrorBlock errorMessage={addUserDetailsError}/>
                <InputBox value={bio} setValue={setBio} label={'About You'} isError={isBioError}/>
                <InputBox value={location} setValue={setLocation} label={'Your locations'} isError={isLocationError}/>
                <button disabled={isFormFetching} type="submit" className={btn.btnSubmit}>
                    Edit
                </button>
                <button disabled={isFormFetching} type="button" onClick={closeModal}
                        className={btn.btnSubmit} style={{marginLeft: '10px'}}
                >
                    Close
                </button>
            </form>
        </ModalWrapper>

    )
}

const mapStateToProps = state => ({
    isFormFetching: state.profilePage.isFormFetching,
    editProfileModal: state.profilePage.editProfileModal,
    addUserDetailsError: state.profilePage.addUserDetailsError
})

export default connect(mapStateToProps,{addUserDetails})(EditProfileModal)