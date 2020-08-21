import React, { useState } from "react"
import { connect } from "react-redux"
import { Link, Route } from "react-router-dom"
import classes from './Header.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faHome, faBell, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import CreatePostModal from "../../components/modals/CreatePostModal"
import Notifications from "../../components/Notifications/Notifications"
import { setCreatePostModalOpen } from "../../store/homeReducer"
import Tooltip from "../../components/common/Tooltip/Tooltip"


const Header = ({isAuth,credentials,notifications,setCreatePostModalOpen}) => {
    const[isNotificationOpen,setIsNotificationsOpen] = useState(false)

    let unreadNotCount = notifications.filter(not => !not.read).length

    return (
        <div className={classes.header}>
            {
                isAuth ? <div className={classes.nav}>
                    <Route exact path={'/'}>
                        <Tooltip text="add post">
                            <div onClick={() => {setCreatePostModalOpen(true)}} onMouseMove={() => {}} className={classes.navIcon}>
                                <FontAwesomeIcon icon={faPlus} size="lg" color='white'/>
                            </div>
                        </Tooltip>
                    </Route>
                    {
                        credentials &&
                        <Route exact path={`/users/${credentials.handle}`}>
                            <Tooltip text="add post">
                                <div onClick={() => {setCreatePostModalOpen(true)}} className={classes.navIcon}>
                                    <FontAwesomeIcon icon={faPlus} size="lg" color='white'/>
                                </div>
                            </Tooltip>
                        </Route>
                    }
                    <Link to={'/'}>
                        <Tooltip text="main page">
                            <div className={classes.navIcon}>
                            <FontAwesomeIcon icon={faHome} size="lg" color='white'/>
                            </div>
                        </Tooltip>
                    </Link>
                    <Link to={credentials ? `/users/${credentials.handle}` : '/'}>
                        <Tooltip text="your profile">
                            <div className={classes.navIcon}>
                                <FontAwesomeIcon icon={faUserAlt} size="lg" color='white'/>
                            </div>
                        </Tooltip>
                    </Link>
                    <div style={{'position': 'relative'}}>
                        <Tooltip text="notifications">
                            <div onMouseDown={() => {setIsNotificationsOpen(!isNotificationOpen)}} className={classes.navIcon}>
                                <FontAwesomeIcon icon={faBell} size="lg" color='white'/>
                            </div>
                        </Tooltip>
                        {
                            unreadNotCount > 0 && <div className={classes.notCount}>{unreadNotCount}</div>
                        }
                        {
                            isNotificationOpen && <Notifications setIsNotificationsOpen={setIsNotificationsOpen} notifications={notifications}/>
                        }
                        <CreatePostModal setCreatePostModalOpen={setCreatePostModalOpen}/>
                    </div>
                </div>
                    : <div className={classes.nav}>
                        <div className={classes.navItem}>
                            <Link to={'/login'}>Login</Link>
                        </div>
                        <div className={classes.navItem}>
                            <Link to={'/'}>Home</Link>
                        </div>
                        <div className={classes.navItem}>
                            <Link to={'/signup'}>Signup</Link>
                        </div>
                    </div>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    credentials: state.profilePage.credentials,
    notifications: state.profilePage.notifications
})


export default connect(mapStateToProps,{setCreatePostModalOpen})(Header)