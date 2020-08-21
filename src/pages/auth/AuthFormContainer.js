import React from "react"
import classes from './auth.module.scss'
import { faLock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const AuthFormContainer = ({height,children}) => {
    return (
        <div className={classes.authPage} style={{height}}>
            <div className={classes.authContent}>
                <div className={classes.lockIcon}>
                    <FontAwesomeIcon icon={faLock} size="2x" color='#fff'/>
                </div>
                {children}
            </div>
        </div>
    )
}

export default AuthFormContainer