import React, {useEffect} from "react";
import { withRouter } from "react-router-dom";
import {connect} from "react-redux";
import homeClasses from "../Home/Home.module.scss";
import Post from "../../components/Post/Post";
import {Preloader} from "../../components/Preloader/Preloaders";
import {getUserDetails} from "../../store/userReducer";
import classes from "../../components/Profile/Profile.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import {getAuthUserDetails, setLikedPosts} from "../../store/profileReducer";

const UserProfile = ({isAuth,userDetails,getUserDetails,match,getAuthUserDetails,userData,setLikedPosts}) => {
    const userHandle = match.params.handle

    useEffect(() => {
        getUserDetails(userHandle)
    },[])

    useEffect(() => {
        console.log('setLikedPosts')
        if(userData){
            setLikedPosts(userData.likes)
        }
    },[userData])

    useEffect(() => {
        console.log('getAuthUserDetails')
        if(isAuth){
            getAuthUserDetails()
        }
    },[isAuth])

    //console.log('userDetails',userDetails)

    return (
        <div>
            {
            userDetails ? <div className={homeClasses.homeContainer}>
                <div className={homeClasses.postsContainer}>
                    {
                        userDetails.posts.map(post => {
                            return <Post key={post.postId} post={post} isUserProfilePost={true}/>
                        })
                    }
                </div>
                <div style={{'width':'33%'}}>
                    <div className={classes.userProfile}>
                        <div className={classes.content}>
                            <div style={{'background': `url(${userDetails.user.imageUrl}) center / cover no-repeat`}}
                                 className={classes.photo}/>
                            <div className={classes.handle}>{userDetails.user.handle}</div>
                            { userDetails.user.bio && <div className={classes.bio}>{userDetails.user.bio}</div>}
                            { userDetails.user.location && <div className={classes.location}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" color='rgba(0,160,202,.8)'/>
                                <span>{userDetails.user.location}</span>
                            </div>}
                            <div className={classes.createdAt}>Joined {moment(userDetails.user.createdAt).calendar()}</div>
                        </div>
                    </div>
                </div>
            </div>
                : <Preloader alignCenter={true} height={'80vh'} />

            }
        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    userDetails: state.userPage.userDetails,
    userData: state.profilePage.userData
})

export default connect(mapStateToProps,{getUserDetails,getAuthUserDetails,setLikedPosts})(withRouter(UserProfile))