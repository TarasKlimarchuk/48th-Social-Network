import React, {useEffect, useState} from "react" 
import classes from './Profile.module.scss'
import {connect} from "react-redux" 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSignOutAlt, faMapMarkerAlt, faPen} from '@fortawesome/free-solid-svg-icons'
import { getAuthUserDetails } from "../../store/profileReducer" 
import { Preloader} from "../Preloader/Preloaders" 
import moment from "moment" 
import { signout } from "../../store/authReducer" 
import btn from "../../cssCommonModules/buttons/buttons.module.scss" 
import {Link} from "react-router-dom" 
import EditProfileModal from "../modals/EditProfileModal" 
import EditPhotoModal from "../modals/EditPhotoModal" 

const Profile = ({isAuth,credentials,getAuthUserDetails,signout}) => {
    const[editProfileModal,setEditProfileModal] = useState(false)
    const[editPhotoModal,setEditPhotoModal] = useState(false)

    useEffect(() => {
        if(isAuth){
            getAuthUserDetails()
        }
    },[isAuth])

    const logout = () => {
        signout() 
    }

    const blockHeight = credentials && credentials.bio && credentials.location ? {'minHeight': '360px'} : {'minHeight': '300px'}

    return (
        <div className={classes.userProfileWrap}>
            <div className={classes.userProfile} style={isAuth ? blockHeight : {'height': '130px'}}>
                { isAuth
                    ?   <div>
                        {
                            credentials
                                ? <div className={classes.content}>
                                    <div style={{'background': `url(${credentials.imageUrl}) center / cover no-repeat`}}
                                         className={classes.photo}>
                                        <div onClick={setEditPhotoModal} className={classes.editPhoto}>
                                            <FontAwesomeIcon icon={faPen} size="lg" color='rgba(0,160,202,.8)'/>
                                        </div>
                                    </div>
                                    <div className={classes.handle}>{credentials.handle}</div>
                                    {credentials.bio && <div className={classes.bio}>{credentials.bio}</div>}
                                    {credentials.location && <div className={classes.location}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" color='rgba(0,160,202,.8)'/>
                                        <span>{credentials.location}</span>
                                    </div>}
                                    <div className={classes.createdAt}>Joined {moment(credentials.createdAt).calendar()}</div>
                                    <div onClick={logout} className={classes.signout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} size="lg" color='rgba(0,160,202,.8)'/>
                                        <span>signout</span></div>
                                     <div onClick={() => {setEditProfileModal(true)}} className={classes.edit}>
                                        <FontAwesomeIcon icon={faPen} size="lg" color='rgba(0,160,202,.8)'/>
                                        <span>edit</span></div>
                                    </div>
                                : <Preloader alignCenter={true} height={'260px'} />
                        }
                        </div>
                    : <div>
                        <div>You are not authorized, please sign in or sign up.</div>
                        <Link to={'/login'} ><button className={btn.btnSubmit} style={{ 'padding': '5px 15px','marginTop':'5px'}}>Login</button></Link>
                        <Link to={'/signup'} ><button className={btn.btnSubmit} style={{ 'padding': '5px 15px','marginTop':'5px','marginLeft': '10px'}}>Sign up</button></Link>
                    </div>
                }
                {
                    editProfileModal && <EditProfileModal setShowModal={setEditProfileModal}/>
                }
                {
                    editPhotoModal && <EditPhotoModal handle={credentials.handle} setEditPhotoModal={setEditPhotoModal}/>
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    credentials: state.profilePage.credentials
})

export default connect(mapStateToProps,{getAuthUserDetails,signout})(Profile)