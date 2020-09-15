import React from "react"
import classes from './Tooltip.module.scss'

const Tooltip = ({text,children}) => {
    return (
        <div className={classes.tooltip}>
            <span className={classes.text}>{text}</span>
                {children}
        </div>
    )
}

export default Tooltip