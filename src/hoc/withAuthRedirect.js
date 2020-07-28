import {Redirect} from "react-router-dom" 
import React from "react" 
import {connect} from "react-redux" 

export const withAuthRedirect = (Component,toRedirect) => {
    const RedirectComponent = (props) => {
        if(props.isAuth) return <Redirect to={toRedirect}/>
        return <Component {...props.isAuth}/>
    }

    const mapStateToProps = state => ({
        isAuth: state.auth.isAuth
    })

    return connect(mapStateToProps)(RedirectComponent)
}

