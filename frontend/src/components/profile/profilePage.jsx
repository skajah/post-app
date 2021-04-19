import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Posts  from '../posts/Posts';
import ProfileDetails from './ProfileDetails';
import TabNav from '../common/TabNav';
import UserContext from '../../context/UserContext';
import _ from 'lodash';

import { getPosts, deletePost } from '../../services/postService';
import { getUser, getFollowers, getFollowing, updateMe } from '../../services/userService';
import { decompress, decompressPosts } from '../../utils/media';
import ProfileSimple from './ProfileSimple';
import './ProfilePage.css';
import { loadLimit } from '../../config.json';

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

    componentDidMount(){
        this.unlisten = this.props.history.listen((location, action) => {
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
        this.setUser(this.props.match.params.id);
    }
    
    componentWillUnmount(){
        this.unlisten();
    }

    handleTabChange = tab => {
        const {  posts, following, followers } = this.state;
        const { id } = this.props.match.params;
        
        if (tab === 'Posts' && !posts) this.setPosts(id);
        else if (tab === 'Following' && !following) this.setFollowing(id);
        else if (tab === 'Followers' && !followers) this.setFollowers(id);
        this.setState({ currentTab: tab });

    }

    handleDelete = async id => {
        
        try {
            const { user, posts: oldPosts } = this.state;

            await deletePost(id);

            const { data: replacement } = await getPosts({ 
                filter: 'userId', 
                filterData: user._id, 
                maxDate: oldPosts[oldPosts.length - 1].date,
                limit: 1
            });

            await decompressPosts(replacement);

            const posts = oldPosts
            .filter(post => post._id !== id)
            .concat(replacement);

            this.setState({ posts, loadMore: replacement.length !== 0  });
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warn("You can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Post not found. Refresh to get latest content");
            }
        }
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
            
            const { data: posts } = await getPosts({
                filter: 'userId',
                filterData: id,
            });    
            await decompressPosts(posts);

            this.setState({ 
                user, 
                posts, 
                currentTab: 'Posts',
                loadMore: posts.length >= loadLimit
            });
        } catch (ex) {
            console.log('Error: ', ex);
        }
    }

    handleLoadMore = async () => {
        const { posts, user } = this.state;
        const { data: morePosts } = await getPosts({
            filter: 'userId',
            filterData: user._id, 
            maxDate: posts[posts.length - 1].date
        });
        await decompressPosts(morePosts);
        const combinedPosts = posts.concat(morePosts);

        this.setState({ posts: combinedPosts, loadMore: morePosts.length >= loadLimit});

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

    handlePostClick = id => {
        this.props.history.push(`/posts/${id}`);
    }

    render() { 
        // console.log('profilePage render()');
        const { 
            user, 
            currentTab, 
            posts, 
            following, 
            followers,
            loadMore } = this.state;

        if (!user) return null;

        return ( 
            <div className="page profile-page">
                <div className="profile-card">
                    <header className="card__header profile-card__header">
                        <ProfileDetails user={user} onFollow={this.handleFollow}/>
                        <TabNav 
                        tabs={this.tabs}
                        currentTab={currentTab}
                        onClick={this.handleTabChange}/>
                    </header>
                <div className="card__body profile-card__body">
                {
                    (currentTab === 'Posts') && 
                    (
                        !posts ? <p>Loading posts...</p> :
                        (
                            !posts.length ? <p>No posts</p> :
                            <div 
                            className="posts-container animate__animated animate__fadeIn">
                                <Posts 
                                posts={posts}
                                onProfileClick={this.handleProfileClick}
                                onPostClick={this.handlePostClick}
                                onDelete={this.handleDelete}
                                onLoadMore={this.handleLoadMore}
                                loadMore={loadMore}
                                />
                            </div>
                        )
                    )
                    
                }
                {
                    (currentTab === 'Following') && 
                    (
                        !following ? <p>Loading followings...</p> :
                        (
                            !following.length ? <p>No followings</p>:
                            <div className="followers animate__animated animate__fadeIn">
                                {
                                following.map(user => <ProfileSimple key={user._id} user={user} onClick={this.handleProfileClick}/>)
                                }
                            </div>
                        )
                    )
                }
                {
                    (currentTab === 'Followers') && 
                    (
                        !followers ? <p>Loading followers..</p> :
                        (
                            !followers.length ? <p>No followers</p> :
                            <div className="followers animate__animated animate__fadeIn">
                                {
                                followers.map(user => <ProfileSimple key={user._id} user={user} onClick={this.handleProfileClick}/>)
                                }
                            </div>
                        )
                    )
                }
                </div>
                </div>
            </div>
         );
    }
}
 
export default ProfilePage;