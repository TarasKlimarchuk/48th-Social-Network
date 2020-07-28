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

export default InputErrorBlock