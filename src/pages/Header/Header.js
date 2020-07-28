import React, {useState} from "react" 
import classes from './Header.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faHome, faBell} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom" 
import {connect} from "react-redux" 
import CreatePostModal from "../../components/modals/CreatePostModal" 
import Notifications from "../../components/Notifications/Notifications" 


const Header = ({isAuth,notifications}) => {
    const[isCreatePostModal,setCreatePostModal] = useState(false)
    const[isNotificationOpen,setIsNotificationsOpen] = useState(false)

    let unreadNotCount = notifications.filter(not => !not.read).length

    return (
        <div className={classes.header}>
            {
                isAuth ? <div className={classes.nav}>
                    <div onClick={() => {setCreatePostModal(true)}} className={classes.navIcon}>
                        <FontAwesomeIcon icon={faPlus} size="lg" color='white'/>
                    </div>
                    <Link to={'/'} ><div className={classes.navIcon}>
                        <FontAwesomeIcon icon={faHome} size="lg" color='white'/>
                    </div></Link>
                    <div style={{'position': 'relative'}}>
                        <div onMouseDown={() => {setIsNotificationsOpen(!isNotificationOpen )}} className={classes.navIcon}>
                            <FontAwesomeIcon icon={faBell} size="lg" color='white'/>
                        </div>
                        {
                            unreadNotCount > 0 && <div className={classes.notCount}>{unreadNotCount}</div>
                        }
                        {
                            isNotificationOpen && <Notifications setIsNotificationsOpen={setIsNotificationsOpen} notifications={notifications}/>
                        }
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
            {
                isCreatePostModal && <CreatePostModal setCreatePostModal={setCreatePostModal}/>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    notifications: state.profilePage.notifications
})


export default connect(mapStateToProps)(Header) 