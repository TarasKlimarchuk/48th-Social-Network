import React from "react";
import classes from './auth.module.css'
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const FormContainer = ({height,...props}) => {
    return (
        <div className={classes.authPage} style={{height}}>
            <div className={classes.authContent}>
                <div className={classes.lockIcon}>
                    <FontAwesomeIcon icon={faLock} size="2x" color='#fff'/>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default FormContainer