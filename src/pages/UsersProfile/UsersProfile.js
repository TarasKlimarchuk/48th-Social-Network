import React, {useEffect} from "react" 
import { withRouter } from "react-router-dom" 
import {connect} from "react-redux" 
import homeClasses from "../Home/Home.module.scss" 
import Post from "../../components/Post/Post" 
import {Preloader} from "../../components/Preloader/Preloaders" 
import {getUserDetails} from "../../store/usersReducer" 
import classes from "../../components/Profile/Profile.module.scss" 
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome" 
import {faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons" 
import moment from "moment" 
import { getAuthUserDetails } from "../../store/profileReducer"

const UsersProfile = ({isAuth,posts,user,getUserDetails,match,getAuthUserDetails}) => {
    const userHandle = match.params.handle
    const postId = match.params.postId

    useEffect(() => {
        getUserDetails(userHandle)
    },[])

    useEffect(() => {
        if(isAuth){
            getAuthUserDetails()
        }
    },[isAuth])

    const postsMarkup = (
        postId ?
            posts.map(post => {
                if(post.postId !== postId){
                    return <Post key={post.postId} post={post} isUserProfilePost={true}/>
                } else {
                    return <Post key={post.postId} post={post} isUserProfilePost={true} commentModalOpen/>
                }
            })
            : posts.map(post => {
                return <Post key={post.postId} post={post} isUserProfilePost={true}/>
            })
    )

    return (
        <div>
            {
                user ?
                    <div className={homeClasses.homeContainer}>
                        <div className={homeClasses.postsContainer}>
                            {
                                posts.length > 0 ? <div>{postsMarkup}</div> : <div>This user has no posts</div>
                            }
                        </div>
                        <div className={classes.userProfileWrap}>
                            <div className={classes.userProfile}>
                                <div className={classes.content}>
                                    <div style={{'background': `url(${user.imageUrl}) center / cover no-repeat`}}
                                         className={classes.photo}/>
                                    <div className={classes.handle}>{user.handle}</div>
                                    {user.bio && <div className={classes.bio}>{user.bio}</div>}
                                    {user.location && <div className={classes.location}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" color='rgba(0,160,202,.8)'/>
                                        <span>{user.location}</span>
                                    </div>}
                                    <div className={classes.createdAt}>Joined {moment(user.createdAt).calendar()}</div>
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
    posts: state.userPage.posts,
    user: state.userPage.user
})

export default withRouter(connect(mapStateToProps,{getUserDetails,getAuthUserDetails})(UsersProfile))