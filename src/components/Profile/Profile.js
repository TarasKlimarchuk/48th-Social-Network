import React from "react"
import { connect } from "react-redux"
import classes from './Profile.module.scss'
import btn from "../../cssCommonModules/buttons.module.scss"
import moment from "moment"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faMapMarkerAlt, faPen } from '@fortawesome/free-solid-svg-icons'
import { setEditPhotoModal, setEditProfileModal } from "../../store/profileReducer"
import { Preloader } from "../common/Preloader/Preloaders"
import { signout } from "../../store/authReducer"
import { Link } from "react-router-dom"
import EditProfileModal from "../modals/EditProfileModal"
import EditPhotoModal from "../modals/EditPhotoModal"

const Profile = ({isAuth, credentials, signout, setEditPhotoModal, setEditProfileModal}) => {

    const openEditPhotoModal = () => {
        setEditPhotoModal(true)
    }

    const openEditProfileModal = () => {
        setEditProfileModal(true)
    }

    const logout = () => {
        signout()
    }

    return (
        <div className={classes.userProfileWrap}>
            <div className={classes.userProfile}>
                {isAuth
                    ? <div>
                        {
                            credentials
                                ? <div className={classes.content}>
                                    <div style={{background: `url(${credentials.imageUrl}) center / cover no-repeat`}}
                                         className={classes.photo}>
                                        <div onClick={openEditPhotoModal} className={classes.editPhoto}>
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
                                    <div onClick={openEditProfileModal} className={classes.edit}>
                                        <FontAwesomeIcon icon={faPen} size="lg" color='rgba(0,160,202,.8)'/>
                                        <span>edit</span>
                                    </div>
                                    <EditProfileModal setShowModal={setEditProfileModal}/>
                                    <EditPhotoModal handle={credentials.handle} setEditPhotoModal={setEditPhotoModal}/>
                                </div>
                                : <Preloader alignCenter={true} height={'260px'}/>
                        }
                    </div>
                    : <div>
                        <div>You are not authorized, please login or sign up.</div>
                        <Link to={'/login'}>
                            <button className={btn.btnSubmit} style={{padding: '5px 15px', marginTop: '5px'}}>
                                Login
                            </button>
                        </Link>
                        <Link to={'/signup'}>
                            <button className={btn.btnSubmit} style={{padding: '5px 15px', marginTop: '5px', marginLeft: '10px'}}>
                                Sign up
                            </button>
                        </Link>
                    </div>
                }

            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    credentials: state.profilePage.credentials,
    isProfileFetching: state.profilePage.isProfileFetching
})

export default connect(mapStateToProps, { signout, setEditPhotoModal, setEditProfileModal})(Profile)