import React, { useEffect, useState } from "react"
import { withAuthRedirect } from "../../hoc/withAuthRedirect"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import classes from "./auth.module.scss"
import { login } from "../../store/authReducer"
import AuthFormContainer from "./AuthFormContainer"
import InputBox from "../../components/common/InputBox/InputBox"
import CredErrorBlock from "../../components/common/CredErrorBlock/CredErrorBlock"

const Login = ({login,loginError,isFormFetching}) => {
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    useEffect(() => {
        setEmail('')
        setPassword('')
    },[loginError])

    const onSubmitHandle = (e) => {
        e.preventDefault()
        login(email,password)
    }

    return (
        <AuthFormContainer height={530}>
            <h2 className={classes.title}>Login as Existing user</h2>
            <form onSubmit={onSubmitHandle} className={classes.form}>
                <CredErrorBlock errorMessage={loginError}/>
                <InputBox value={email} setValue={setEmail} label={'Email'} />
                <InputBox value={password} setValue={setPassword} label={'Password'} />
                <button disabled={isFormFetching} className={classes.button} type="submit" >LOGIN</button>
            </form>
            <div className={classes.link}>
                <small>Do not have an account? sign up <Link to={'/signup'}>here</Link></small>
            </div>
        </AuthFormContainer>
    )
}

const mapStateToProps = (state) => ({
    isFormFetching: state.auth.isFormFetching,
    loginError: state.auth.loginError
})

export default withAuthRedirect(connect(mapStateToProps, {login})(Login), '/')