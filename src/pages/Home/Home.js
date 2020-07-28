import React, { useEffect } from 'react' 
import classes from './Home.module.scss'
import { connect } from "react-redux" 
import { getPosts } from "../../store/homeReducer" 
import Post from "../../components/Post/Post" 
import { Preloader } from "../../components/Preloader/Preloaders" 
import Profile from "../../components/Profile/Profile" 

const Home = ({getPosts,posts}) => {

    useEffect(() => {
        getPosts()
    },[])

    return (
        <div className={classes.homeContainer}>
            {
                posts.length !== 0 ? <div className={classes.postsContainer}>
                    {
                        posts.map(post => {
                            return <Post key={post.postId} post={post} />
                        })
                    }
                </div> : <div style={{'width':'65%'}}>
                            <Preloader alignCenter={true} height={'80vh'} />
                        </div>
            }
            <Profile />
        </div>
    )
}

const mapStateToProps = state => ({
    posts: state.homePage.posts
})


export default connect(mapStateToProps,{getPosts})(Home)
