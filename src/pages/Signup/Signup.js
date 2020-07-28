import React from "react";
import classes from './Login.module.scss'
import btn from '../../cssModules/buttons/buttons.module.scss'

const Login = () => {
    return (
        <div className={classes.loginPage}>
            <h2 className={classes.title}>Login</h2>
            <form>
                <div className={classes.field}>
                    <input type="text" required autoComplete="off" id="login"/>
                    <label htmlFor="login" title="Login" data-title="login"/>
                </div>
                <div className={classes.field} style={{'marginTop': '40px'}}>
                    <input type="password" required autoComplete="off" id="password"/>
                    <label htmlFor="password" title="Password" data-title="password"/>
                </div>
                <button className={btn.btnSubmit} style={{ 'marginLeft':'210px','marginTop': '30px'}}>Login</button>
            </form>
        </div>
    )
}

export default Login;