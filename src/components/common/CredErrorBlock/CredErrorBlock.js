import React, { FC } from "react";
import classes from './CredErrorBlock.module.css'

type OwnProps = {
    errorMessage: string | null
}

const CredErrorBlock:FC<OwnProps> = ({errorMessage}) => {

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