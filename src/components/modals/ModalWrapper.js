import React, {useRef} from "react"
import classes from "./Modal.module.scss"

const ModalWrapper = ({closeModal, modalWrapCenter = true, isModalOpen, children}) => {

    const modalWrap = useRef()
    const handleClickOutside = e => {
        if (e.target === modalWrap.current) {
            closeModal()
        }
    }

    return (
        <>
            {
                isModalOpen && <div className={modalWrapCenter ? classes.modalWrapCenter : classes.modalWrap} onMouseDown={handleClickOutside} ref={modalWrap}>
                    <div className={classes.modal}>
                        {children}
                    </div>
                </div>
            }
        </>
    )
}

export default ModalWrapper