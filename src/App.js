import React, {useEffect} from 'react' 
import './App.css' 
import {Route, Switch, withRouter} from 'react-router-dom'
import Header from "./pages/Header/Header" 
import Login from "./pages/Login/Login" 
import Signup from "./pages/Signup/Signup" 
import jwtDecode from "jwt-decode" 
import {connect} from "react-redux" 
import {initializeApp} from "./store/authReducer" 
import Home from "./pages/Home/Home" 
import axios from "axios" 
import UserProfile from "./pages/UsersProfile/UsersProfile" 

const App = ({initializeApp,isAuthenticated,...props}) => {
    useEffect(() => {
        const token = localStorage.FBIdToken
        if(token){
            const decodedToken = jwtDecode(token)
            if(decodedToken.exp * 1000 < Date.now()){
                localStorage.removeItem('FBIdToken')
                if(isAuthenticated === true) initializeApp(false)
                props.history.push('/login')
            } else {
                axios.defaults.headers.common['Authorization'] = token
                initializeApp(true)
            }
        }
    },[isAuthenticated])

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
                <Route exact path='/users/:handle'>
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
    isAuthenticated: state.auth.isAuth
})

export default withRouter(connect(mapStateToProps, {initializeApp})(App)) 
