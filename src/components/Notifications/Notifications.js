import React, {useEffect, useRef} from "react" 
import classes from './Notifications.module.scss'
import {connect} from "react-redux" 
import moment from "moment" 
import {Link} from "react-router-dom" 
import {faHeart,faComment} from "@fortawesome/free-solid-svg-icons" 
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome" 
import {markNotificationsRead} from "../../store/profileReducer" 

const Notifications = ({setIsNotificationsOpen,notifications,markNotificationsRead}) => {
    const node = useRef()
    const unreadNotifications = notifications.filter(not => !not.read)

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside) 

        return () => {
            if(unreadNotifications.map(not => not.notificationId).length > 0){
                markNotificationsRead(unreadNotifications.map(not => not.notificationId))
            }
            document.removeEventListener("mousedown", handleClickOutside) 
        } 
    }, []) 

    const handleClickOutside = e => {
        if (!node.current.contains(e.target)) {
            setIsNotificationsOpen(false)
        }
    } 

    return (
        <div className={classes.notifications} onClick={handleClickOutside} ref={node}>
            {
                notifications.length > 0 ? notifications.map(not => {
                    const action = not.type === 'like' ? 'liked' : 'commented on'
                    const time = moment(not.createdAt).fromNow()
                    const icon = not.type === 'like'
                        ? not.read ? <FontAwesomeIcon icon={faHeart} size="lg" color='rgb(0,160,202)'/> : <FontAwesomeIcon icon={faHeart} size="lg" color='rgb(255,75,0)'/>
                        : not.read ? <FontAwesomeIcon icon={faComment} size="lg" color='rgb(0,160,202)'/> : <FontAwesomeIcon icon={faComment} size="lg" color='rgb(255,75,0)'/>
                    return (
                        <Link to={`/users/${not.recipient}/post/${not.postId}`} key={not.createdAt} className={classes.not}>
                            {icon}
                            <span>
                                {not.sender} {action} your post ({time})
                            </span>
                        </Link>
                    )
                })
                    :
                    <div style={{'padding':'20px 0 20px 20px','fontSize':'20px'}}>
                        You have no notifications yet
                    </div>
            }
        </div>
    )
}

export default connect(null,{markNotificationsRead})(Notifications)