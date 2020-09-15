import React, {useEffect, useRef, useState} from "react"
import classes from "./Modal.module.scss"
import {CSSTransition} from "react-transition-group";

const ModalWrapper = ({closeModal, modalWrapCenter = true, isModalOpen, children}) => {
    const[isTransition,setIsTransition] = useState(false)

    const modalWrap = useRef()
    const handleClickOutside = e => {
        if (e.target === modalWrap.current) {
            closeModal()
        }
    }

    useEffect(() => {
        if(isModalOpen) setIsTransition(true)
        else setIsTransition(false)
    },[isModalOpen])

    return (
        <>
            {
                isModalOpen &&
                    <div className={modalWrapCenter ? classes.modalWrapCenter : classes.modalWrap} onMouseDown={handleClickOutside} ref={modalWrap}>
                        <CSSTransition
                            in={isTransition}
                            timeout={300}
                            classNames="modal"
                            unmountOnExit
                        >
                            <div className={classes.modal}>
                                {children}
                            </div>
                        </CSSTransition>
                    </div>

            }
        </>
    )
}

export default ModalWrapper