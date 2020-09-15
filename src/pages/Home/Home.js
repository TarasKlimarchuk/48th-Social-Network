import React, { useEffect } from 'react' 
import { connect } from "react-redux"
import classes from './Home.module.scss'
import { getPosts } from "../../store/homeReducer"
import Post from "../../components/Post/Post" 
import { Preloader } from "../../components/common/Preloader/Preloaders"
import Profile from "../../components/Profile/Profile"
import { getAuthUserDetails } from "../../store/profileReducer"
import {CSSTransition, TransitionGroup} from "react-transition-group";

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
                            <TransitionGroup>
                                {
                                posts.map(post => {
                                    return (
                                        <CSSTransition
                                            key={post.postId}
                                            timeout={500}
                                            classNames="post"
                                        >
                                            <Post post={post} />
                                        </CSSTransition>
                                    )
                                })
                            }
                            </TransitionGroup>
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
                            <span className={classes.postsTitle}>POSTS</span>
                            <TransitionGroup>
                                {
                                    posts.map(post => {
                                        return (
                                            <CSSTransition
                                                key={post.postId}
                                                timeout={500}
                                                classNames="post"
                                            >
                                                <Post post={post} />
                                            </CSSTransition>
                                        )
                                    })
                                }
                            </TransitionGroup>
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
