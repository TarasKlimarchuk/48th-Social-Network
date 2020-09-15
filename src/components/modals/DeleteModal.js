import React from "react"
import { connect } from "react-redux"
import btn from "../../cssCommonModules/buttons.module.scss"
import ModalWrapper from "./ModalWrapper"
import { Preloader } from "../common/Preloader/Preloaders"

const DeleteModal = ({onDelete,title,setDeletePostModal,isModalOpen,isHomeFormFetching,isDeleteFetching}) => {

    const closeModal = () => {
        setDeletePostModal(false)
    }

    return (
        <ModalWrapper closeModal={closeModal} isModalOpen={isModalOpen}>
            <h4>{title}</h4>
            {isDeleteFetching && <Preloader/>}
            {isHomeFormFetching && <Preloader/>}
            <button disabled={isHomeFormFetching || isDeleteFetching} onClick={onDelete} type="button" className={btn.btnRed} style={{marginTop:'30px'}}>Delete</button>
            <button disabled={isHomeFormFetching || isDeleteFetching} onClick={closeModal} type="button" className={btn.btnSubmit} style={{marginLeft:'10px',marginTop:'30px'}}>Cancel</button>
         </ModalWrapper>
    )
}

const mapStateToProps = state => ({
    isHomeFormFetching: state.homePage.isFormFetching,
    isDeleteFetching: state.postPage.isDeleteFetching
})

export default connect(mapStateToProps)(DeleteModal)