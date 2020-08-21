import React, { useEffect } from 'react'
import { connect } from "react-redux"
import { Route, Switch, withRouter } from 'react-router-dom'
import axios from "axios"
import jwtDecode from "jwt-decode"
import './App.css'
import { authorizationsSuccess } from "./store/authReducer"
import Header from "./pages/Header/Header"
import Home from "./pages/Home/Home"
import UserProfile from "./pages/UsersProfile/UsersProfile"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"

const App = ({authorizationsSuccess,isAuth,...props}) => {
    useEffect(() => {
        const token = localStorage.FBIdToken
        if(token){
            const decodedToken = jwtDecode(token)
            if(decodedToken.exp * 1000 < Date.now()){
                localStorage.removeItem('FBIdToken')
                if(isAuth === true) authorizationsSuccess(false)
                props.history.push('/login')
            } else {
                axios.defaults.headers.common['Authorization'] = token
                authorizationsSuccess(true)
            }
        }
    },[isAuth])

    return (
        <div className="App">
            <Header/>
            <Switch>
                <Route exact path='/'>
                    <Home/>
                </Route>
                <Route exact path='/login'>
                    <Login/>
                </Route>
                <Route exact path='/signup'>
                    <Signup/>
                </Route>
                <Route exact  path='/users/:handle'>
                    <UserProfile/>
                </Route>
                <Route exact path='/users/:handle/post/:postId'>
                    <UserProfile/>
                </Route>
            </Switch>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default withRouter(connect(mapStateToProps, {authorizationsSuccess})(App))
