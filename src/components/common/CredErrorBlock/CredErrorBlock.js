import React from "react"
import classes from './CredErrorBlock.module.scss'

const CredErrorBlock = ({errorMessage}) => {

    if(errorMessage){
        return (
            <div className={classes.credErrorBlock}>
                {errorMessage}
            </div>
        )
    }

    return null
}

export default CredErrorBlock