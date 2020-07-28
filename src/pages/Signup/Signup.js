import React, {useState} from "react" 
import classes from '../../cssCommonModules/forms/Form.module.scss'
import btn from '../../cssCommonModules/buttons/buttons.module.scss'
import {connect} from "react-redux" 
import { signup } from "../../store/authReducer" 
import {Link} from "react-router-dom" 
import {withAuthRedirect} from "../../hoc/withAuthRedirect" 
import {Preloader} from "../../components/Preloader/Preloaders"
import InputErrorBlock from "../../components/common/InputErrorBlock"

const Signup = ({credentialsError,signup,isFetching}) => {
    const[handle,setHandle] = useState('')
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const[confirmPassword,setConfirmPassword] = useState('')

    const submitHandler = e => {
        e.preventDefault()
        signup(handle,email,password,confirmPassword)
    }

    const isHandleError = credentialsError && credentialsError.userHandle
    const isEmailError = credentialsError && credentialsError.email
    const isConfirmPasswordError = credentialsError && credentialsError.confirmPassword
    const isCredError = credentialsError && credentialsError.error

    return (
        <div className={classes.loginPage}>
            <h2 className={classes.title}>Signup</h2>
            <form onSubmit={submitHandler}>
                <div className={isHandleError || isCredError ? `${classes.field} ${classes.inputError}` : classes.field} style={{'marginTop': '40px'}}>
                    <input value={handle} onChange={e => {setHandle(e.target.value)}} required type="text" id="handle"/>
                    <label htmlFor="handle" title="login" data-title="login"/>
                    <InputErrorBlock isError={isHandleError} errorClass={classes.emailErrorMessage} errorMessage={isHandleError}/>
                </div>
                <div className={isEmailError || isCredError ? `${classes.field} ${classes.inputError}` : classes.field} style={{'marginTop': '40px'}}>
                    <input value={email} onChange={e => {setEmail(e.target.value)}} type="text" required id="email"/>
                    <label htmlFor="email" title="email" data-title="email"/>
                    <InputErrorBlock isError={isEmailError} errorClass={classes.emailErrorMessage} errorMessage={isEmailError}/>
                </div>
                <div className={isCredError ? `${classes.field} ${classes.inputError}` : classes.field} style={{'marginTop': '40px'}}>
                    <input value={password} onChange={e => {setPassword(e.target.value)}} required type="password" id="password"/>
                    <label htmlFor="password" title="password" data-title="password"/>
                    <InputErrorBlock isError={isCredError} errorClass={classes.credErrorMessage} errorMessage={ isCredError && credentialsError.error}/>
                </div>
                <div className={isConfirmPasswordError || isCredError ? `${classes.field} ${classes.inputError}` : classes.field} style={{'marginTop': '40px'}}>
                    <input value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value)}} required type="password" id="confirmPassword"/>
                    <label htmlFor="confirmPassword" title="confirm password" data-title="confirm password"/>
                    <InputErrorBlock isError={isConfirmPasswordError} errorClass={classes.emailErrorMessage} errorMessage={isConfirmPasswordError}/>
                </div>
                <InputErrorBlock isError={isCredError} errorClass={classes.credErrorMessage} errorMessage={isCredError}/>
                { isFetching && <Preloader/>}
                <div style={{width:'100%',display:'flex',justifyContent:"center",marginTop:'20px'}}>
                    <button disabled={isFetching} className={btn.btnSubmit}>Signup</button>
                </div>
            </form>
            <div style={{'textAlign':'center','marginTop':'10px'}}>
                <small>Already have an account? login <Link to={'/login'}>here</Link></small>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return ({
        isFetching: state.auth.isFetching,
        credentialsError: state.auth.credentialsError
    })
}

export default withAuthRedirect(connect(mapStateToProps, {signup})(Signup),'/') 