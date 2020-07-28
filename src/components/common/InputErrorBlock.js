import React from "react"

const InputErrorBlock = ({isError,errorClass,errorMessage}) => {
    return (
        <div>
            {
                isError && <div className={errorClass}>{errorMessage}</div>
            }
        </div>
    )
}
// {isEmailError && <div className={classes.emailErrorMessage}>{credentialsError.email}</div>}
export default InputErrorBlock