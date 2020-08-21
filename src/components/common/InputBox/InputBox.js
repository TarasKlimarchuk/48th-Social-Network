import React from "react"
import classes from "./InputBox.module.scss"


const InputBox = ({value,label,setValue,isError}) => {

    const type = label === 'Password' || label === 'Confirm Password' ? 'password' : 'text'

    if(isError) {
        return (
            <div className={classes.inputBox}>
                <input value={value} onChange={(e) => {setValue(e.target.value)}} className={classes.errorInput} type={type} id={label} required />
                <label className={classes.errorLabel} htmlFor={label}>{label}</label>
            </div>
        )
    }

    return (
        <div className={classes.inputBox}>
            <input value={value} onChange={(e) => {setValue(e.target.value)}} className={classes.input} type={type} id={label} required />
            <label className={classes.label} htmlFor={label}>{label}</label>
        </div>
    )
}

export default InputBox