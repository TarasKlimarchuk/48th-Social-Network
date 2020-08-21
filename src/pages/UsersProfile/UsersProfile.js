import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom" 
import {connect} from "react-redux"
import classes from "../../components/Profile/Profile.module.scss"
import homeClasses from "../Home/Home.module.scss"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"
import Post from "../../components/Post/Post"
import { Preloader } from "../../components/common/Preloader/Preloaders"
import { getUserDetails } from "../../store/usersReducer"
import { getAuthUserDetails } from "../../store/profileReducer"
import Profile from "../../components/Profile/Profile"

const UsersProfile = ({isAuth,credentials,posts,user,getUserDetailsFetching,getUserDetails,match,getAuthUserDetails}) => {
    const userHandle = match.params.handle
    const postId = match.params.postId
    const[isAuthUserProfile,setIsAuthUserProfile] = useState(false)

    if(user && userHandle !== user.handle){
        window.history.go(0)
    }

    const filteredPosts = posts.sort((a, b) =>  {
        a = new Date(a.createdAt)
        b = new Date(b.createdAt)
        return a>b ? -1 : a<b ? 1 : 0
    })

    useEffect(() => {
        if(credentials && user && user.handle === credentials.handle){
            setIsAuthUserProfile(true)
        } else {
            setIsAuthUserProfile(false)
        }
    },[user,credentials])

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
            filteredPosts.map(post => {
                if(post.postId !== postId){
                    return <Post key={post.postId} post={post}/>
                } else {
                    return <Post key={post.postId} post={post} commentModalOpen/>
                }
            })
            : filteredPosts.map(post => {
                return <Post key={post.postId} post={post}/>
            })
    )

    return (
        <div>
            {
                !getUserDetailsFetching && user ?
                    <div className={homeClasses.homeContainer}>
                        <div className={homeClasses.postsContainer}>
                            <span className={classes.postsTitle}>posts of {user.handle}</span>
                            {
                                posts.length > 0 ? <div>{postsMarkup}</div> : <div>This user has no posts</div>
                            }
                        </div>
                        {
                            isAuthUserProfile ? <Profile/> : <div className={classes.userProfileWrap}>
                                <div className={classes.userProfile}>
                                    <div className={classes.content}>
                                        <div style={{background: `url(${user.imageUrl}) center / cover no-repeat`}} className={classes.photo}/>
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
                        }
                    </div>
                : <Preloader alignCenter={true} height={'80vh'} />
            }
        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    posts: state.userPage.posts,
    user: state.userPage.user,
    getUserDetailsFetching: state.userPage.getUserDetailsFetching,
    credentials: state.profilePage.credentials
})

export default withRouter(connect(mapStateToProps,{getUserDetails,getAuthUserDetails})(UsersProfile))