import React, { useState } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import classes from "./auth.module.scss"
import { withAuthRedirect } from "../../hoc/withAuthRedirect"
import { signup } from "../../store/authReducer"
import CredErrorBlock from "../../components/common/CredErrorBlock/CredErrorBlock"
import InputBox from "../../components/common/InputBox/InputBox"
import AuthFormContainer from "./AuthFormContainer"

const Signup = ({signup,signupError,isFormFetching}) => {
    const[handle, setHandle] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[confirmPassword, setConfirmPassword] = useState('')

    const onSubmitHandle = (e) => {
        e.preventDefault()
        signup(handle,email,password,confirmPassword)
    }

    return (
        <AuthFormContainer height={650}>
            <h2 className={classes.title}>Create an account</h2>
            <form onSubmit={onSubmitHandle} className={classes.form}>
                <CredErrorBlock errorMessage={signupError}/>
                <InputBox value={handle} setValue={setHandle} label={'Handle'} />
                <InputBox value={email} setValue={setEmail} label={'Email'} />
                <InputBox value={password} setValue={setPassword} label={'Password'} />
                <InputBox value={confirmPassword} setValue={setConfirmPassword} label={'Confirm Password'} />
                <button disabled={isFormFetching} className={classes.button} type="submit">LOGIN</button>
            </form>
            <div className={classes.link}>
                <small>Already have an account? login <Link to={'/login'}>here</Link></small>
            </div>
        </AuthFormContainer>
    )
}

const mapStateToProps = (state) => ({
    isFormFetching: state.auth.isFormFetching,
    signupError: state.auth.signupError
})

export default withAuthRedirect(connect(mapStateToProps,{signup})(Signup), '/')