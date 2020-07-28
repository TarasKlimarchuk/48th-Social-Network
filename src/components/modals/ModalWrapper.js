import React, {useRef} from "react" 
import classes from "./Modal.module.scss"

const ModalWrapper = ({closeModal, modalWrapCenter = true, ...props}) => {

    const modalWrap = useRef()
    const handleClickOutside = e => {
        if(e.target === modalWrap.current){
            closeModal(false)
        }
    }

    return (
        <div className={modalWrapCenter ? classes.modalWrapCenter : classes.modalWrap} onClick={handleClickOutside} ref={modalWrap}>
            <div className={classes.modal}>
                {props.children}
            </div>
        </div>
    )
}

export default ModalWrapper