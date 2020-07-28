import React, {useState} from "react" 
import classes from '../../cssCommonModules/forms/Form.module.scss'
import btn from '../../cssCommonModules/buttons/buttons.module.scss'
import {connect} from "react-redux" 
import {login} from "../../store/authReducer" 
import {Link} from "react-router-dom" 
import { withAuthRedirect } from "../../hoc/withAuthRedirect" 
import {Preloader} from "../../components/Preloader/Preloaders"
import InputErrorBlock from "../../components/common/InputErrorBlock";

const Login = ({login,isFetching,credentialsError}) => {
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const isEmailError = credentialsError && credentialsError.email
    const isCredError = credentialsError && credentialsError.error

    const submitHandler = e => {
        e.preventDefault()
        login(email,password)
    }

    return (
             <div className={classes.loginPage}>
                <h2 className={classes.title}>Login</h2>
                <form onSubmit={submitHandler}>
                    <div className={isEmailError || isCredError ? `${classes.field} ${classes.inputError}` : classes.field} style={{'marginTop': '20px'}}>
                        <input value={email} onChange={e => {setEmail(e.target.value)}} type="text" required id="email"/>
                        <label htmlFor="email" title="email" data-title="email"/>
                        <InputErrorBlock isError={isEmailError} errorClass={classes.emailErrorMessage} errorMessage={ isEmailError && credentialsError.email}/>
                    </div>
                    <div className={isCredError ? `${classes.field} ${classes.inputError}` : classes.field} style={{'marginTop': '40px'}}>
                        <input value={password} onChange={e => {setPassword(e.target.value)}} type="password" required id="password"/>
                        <label htmlFor="password" title="password" data-title="password"/>
                    </div>
                        <InputErrorBlock isError={isCredError} errorClass={classes.credErrorMessage} errorMessage={ isCredError && credentialsError.error}/>
                    { isFetching && <Preloader/>}
                    <div style={{width:'100%',display:'flex',justifyContent:"center",marginTop:'20px'}}>
                        <button disabled={isFetching} className={btn.btnSubmit}>Login</button>
                    </div>
                </form>
                 <div style={{'textAlign':'center','marginTop':'10px'}}>
                     <small>Do not have an account? sign up <Link to={'/signup'}>here</Link></small>
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


export default withAuthRedirect(connect(mapStateToProps, {login})(Login),'/') 