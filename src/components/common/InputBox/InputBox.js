import React from "react";
import classes from "./auth.module.css";


const InputBox = ({value,label,setValue}) => {

    const type = label === 'Email' || label === 'Handle' ? 'text' : 'password'

    return (
        <div className={classes.inputBox}>
            <input value={value} onChange={(e) => {setValue(e.target.value)}} className={classes.input} type={type} id={label} required />
            <label className={classes.label} htmlFor={label}>{label}</label>
        </div>
    )
}

export default InputBox