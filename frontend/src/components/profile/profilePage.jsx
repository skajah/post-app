import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ProfileDetails from './ProfileDetails';
import TabNav from '../common/tabNav';
import UserContext from '../../context/userContext';
import Posts from '../posts/Posts';
import _ from 'lodash';

import { getUserPosts, deletePost } from '../../services/postService';
import { getUser, getFollowers, getFollowing, updateMe } from '../../services/userService';
import { makeDate } from '../../utils/makeDate';
import { decompress } from '../../utils/media';
import ProfileSimple from './ProfileSimple';
import './ProfilePage.css';

class ProfilePage extends Component {
    static contextType = UserContext;

    state = {
        currentTab: 'Posts',
        posts: null,
        user: null,
        following: null,
        followers: null,
    }   

    tabs = ['Posts', 'Following', 'Followers']

    componentWillMount(){
        this.unlisten = this.props.history.listen((location, action) => {
            console.log('History change: ', location.pathname);
            let path = location.pathname;
            if (path.startsWith('/profile')){
                path = location.pathname.endsWith('/') ?
                location.pathname.substring(1, location.pathname.length) : 
                location.pathname.substring(1);
                const parts = path.split('/');
                if (parts.length === 2 && parts[1] !== 'edit')
                    this.setUser(parts[1]);
            }
        });
    }
    componentWillUnmount(){
        this.unlisten();
    }

    componentDidMount(){
        console.log('profilePage componentDidMount()');
        this.setUser(this.props.match.params.id);
    }

    handleTabChange = tab => {
        const {  posts, following, followers } = this.state;
        const { id } = this.props.match.params;
        
        if (tab === 'Posts' && !posts) this.setPosts(id);
        else if (tab === 'Following' && !following) this.setFollowing(id);
        else if (tab === 'Followers' && !followers) this.setFollowers(id);
        this.setState({ currentTab: tab });

    }

    handleDelete = async ({ _id }) => {
        const originalPosts = this.state.posts;
        const posts = originalPosts.filter(post => post._id !== _id);
        this.setState({ posts });
        try {
            await deletePost(_id);
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warn("You can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Post not found. Refresh to get latest content");
            }
            this.setState({ posts: originalPosts });
        }
    }

    handlePostClick = ({ _id }) => {
        this.props.history.push(`/posts/${_id}`);
    }

    setFollowing = async (id) => {
        try {
            const { data: following } = await getFollowing(id);
            for (const profile of following) {
                if (profile.profilePic)
                    profile.profilePic = await decompress(profile.profilePic);
            }
            this.setState({ following });
        } catch (ex) {
            console.log('Error: ', ex);
        }
    }

    setFollowers = async (id) => {
        try {
            const { data: followers } = await getFollowers(id);
            for (const profile of followers) {
                if (profile.profilePic)
                    profile.profilePic = await decompress(profile.profilePic);
            }
            this.setState({ followers });
        } catch (ex) {
            console.log('Error: ', ex);
        }
    }

    setUser = async (id) => {
        try {
            const { data: user } = await getUser(id);
            if (user.profilePic)
                user.profilePic = await decompress(user.profilePic);
            
            const { data: posts } = await getUserPosts(id);        
            for (const post of posts) {
                makeDate(post);
                if (post.media)
                    post.media.data = await decompress(post.media.data);
                if (post.user.profilePic)
                    post.user.profilePic = await decompress(post.user.profilePic);
            }
            this.setState({ user, posts, following: null, followers: null, currentTab: 'Posts'});
        } catch (ex) {
            console.log('Error: ', ex);
        }
    }

    handleFollow = async () => {
        const id = this.state.user._id;
        const { currentUser } = this.context;
        const isFollowing = currentUser.following[id] ? true : false;
        await updateMe({ following: { id, follow: !isFollowing } });
        this.context.onFollow(id);
        let followers = this.state.followers ? [...this.state.followers] : [];
        if (isFollowing)
            followers = followers.filter(user => user._id !== currentUser._id);
        else
            followers.unshift(_.pick(currentUser, ['_id', 'username', 'profilePic']));

        let following;
        if (currentUser._id === id){ // my own profile
            following = this.state.following ? [...this.state.following] : [];
            if (isFollowing)
                following = following.filter(user => user._id !== currentUser._id);
            else
                following.unshift(_.pick(currentUser, ['_id', 'username', 'profilePic']));
        } 

        if (following) return this.setState({ followers, following });
        this.setState({ followers });
    }

    handleProfileClick = (id) => {
        this.props.history.push(`/profile/${id}`);
    }

    render() { 
        // console.log('profilePage render()');
        const { user, currentTab, posts, following, followers  } = this.state;

        if (!user) return null;

        const sameUser = this.context.currentUser._id === user._id || false;

        return ( 
            <div className="profile-page">
                <div className="profile-page-header">
                    <ProfileDetails user={user} onFollow={this.handleFollow}/>
                    <TabNav 
                    tabs={this.tabs}
                    currentTab={currentTab}
                    onClick={this.handleTabChange}/>
                </div>
                {
                    (currentTab === 'Posts') && 
                    (
                        !posts ? <p>Loading posts...</p> :
                        <React.Fragment>
                            <p>
                                {
                                 !posts.length ?
                                 "No posts" :
                                `${posts.length} Post(s)`
                                }
                            </p>
                            <Posts 
                            posts={posts}
                            onDelete={this.handleDelete}
                            onPostClick={this.handlePostClick}
                            hideOptionMenu={true}/>
                        </React.Fragment>
                        
                    )
                    
                }
                {
                    (currentTab === 'Following') && 
                    (
                        !following ? <p>Loading followings...</p> :
                        <React.Fragment>
                            <p>
                                {
                                 !following.length ?
                                 "No followings" :
                                `Following ${following.length} user(s)`
                                }
                            </p>
                            {
                            following.map(user => <ProfileSimple key={user._id} user={user} onClick={this.handleProfileClick}/>)
                            }
                        </React.Fragment>
                    )
                }
                {
                    (currentTab === 'Followers') && 
                    (
                        !followers ? <p>Loading followers..</p> :
                        <React.Fragment>
                            <p>
                                {
                                 !followers.length ?
                                 "No followers" :
                                `${followers.length} follower(s)`
                                }
                            </p>
                            {
                            followers.map(user => <ProfileSimple key={user._id} user={user} onClick={this.handleProfileClick}/>)
                            }
                            </React.Fragment>
                        
                    )
                }
            </div>
         );
    }
}
 
export default ProfilePage;