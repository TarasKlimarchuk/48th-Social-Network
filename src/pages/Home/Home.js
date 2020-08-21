import React, { useEffect } from 'react' 
import { connect } from "react-redux"
import classes from './Home.module.scss'
import { getPosts } from "../../store/homeReducer"
import Post from "../../components/Post/Post" 
import { Preloader } from "../../components/common/Preloader/Preloaders"
import Profile from "../../components/Profile/Profile"
import { getAuthUserDetails } from "../../store/profileReducer"

const Home = ({isAuth,getAuthUserDetails,getPosts,posts,isHomePageFetching,isProfileFetching}) => {
    const isMobileScreenWidth = document.documentElement.clientWidth <= 700

    useEffect(() => {
        if (isAuth) {
            getAuthUserDetails()
        }
    }, [isAuth])

    useEffect(() => {
        getPosts()
    },[])

    if(isAuth){
       return (
           <div className={classes.homeContainer}>
               {
                !isHomePageFetching && !isProfileFetching ?
                    <>
                        <div className={classes.postsContainer}>
                            <span className={classes.postsTitle}>POSTS</span>
                            {
                                posts.map(post => {
                                    return <Post key={post.postId} post={post} />
                                })
                            }
                        </div>
                        { !isMobileScreenWidth && <Profile /> }
                    </>
                    : <div style={{width:'100%'}}>
                        <Preloader alignCenter={true} height={'80vh'} />
                    </div>
               }
           </div>
       )
    }
    return (
        <div className={classes.homeContainer}>
            {
                !isHomePageFetching ? <>
                        <div className={classes.postsContainer}>
                            {
                                posts.map(post => {
                                    return <Post key={post.postId} post={post} />
                                })
                            }
                        </div>
                        { !isMobileScreenWidth && <Profile /> }
                    </>
                    : <div style={{width:'100%'}}>
                        <Preloader alignCenter={true} height={'80vh'} />
                    </div>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth,
    posts: state.homePage.posts,
    isHomePageFetching: state.homePage.isHomePageFetching,
    isProfileFetching: state.profilePage.isProfileFetching
})


export default connect(mapStateToProps,{getAuthUserDetails,getPosts})(Home)
