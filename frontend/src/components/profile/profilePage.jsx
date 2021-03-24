import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ProfileDetails from './profileDetails';
import TabNav from '../common/tabNav';
import UserContext from '../../context/userContext';
import Posts from '../posts/posts';
import _ from 'lodash';

import { getUserPosts, deletePost } from '../../services/postService';
import { getUser, getFollowers, getFollowing, updateMe } from '../../services/userService';
import { makeDates } from '../../utils/makeDate';
import { decompress } from '../../utils/media';
import ProfileSimple from './profileSimple';

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
        console.log('profilePage componentDidMount()');
        this.setUser();
        this.setPosts();
    }

    handleTabChange = tab => {
        const {  posts, following, followers } = this.state;

        if (tab === this.tabs[0] && !posts) this.setPosts();
        else if (tab === this.tabs[1] && !following) this.setFollowing();
        else if (tab === this.tabs[2] && !followers) this.setFollowers();
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

    setPosts = async () => {
        try {
            const { data: posts } = await getUserPosts(this.props.match.params.id);
            makeDates(posts);
            this.setState({ posts });
        } catch (ex) {
            // REVISIT
            console.log('Error: ', ex);
        }
    }

    setFollowing = async () => {
        const { data: following } = await getFollowing(this.props.match.params.id);
        following.forEach(profile => {
            if (profile.profilePic)
                profile.profilePic = decompress(profile.profilePic);
        });
        this.setState({ following });
    }
    setFollowers = async () => {
        const { data: followers } = await getFollowers(this.props.match.params.id);
        followers.forEach(profile => {
            if (profile.profilePic)
                profile.profilePic = decompress(profile.profilePic);
        });
        this.setState({ followers });
    }

    setUser = async () => {
        const { data: user } = await getUser(this.props.match.params.id);
        if (user.profilePic)
            user.profilePic = decompress(user.profilePic);
        this.setState({ user, posts: null, following: null, followers: null, currentTab: 'Posts'});
        
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


        if (user && user._id !== this.props.match.params.id){
            this.setUser();
            this.setPosts();
            return null;
        }

        const sameUser = user ? this.context.currentUser._id === user._id : false;

        return ( 
            <div className="profile-page">
                <div className="card center">
                    <div className="card-header"> 
                        { 
                        user &&
                        <ProfileDetails user={user} onFollow={this.handleFollow}/>
                        }    
                    </div>
                    <div className="card-body">
                        <TabNav 
                        tabs={this.tabs}
                        currentTab={currentTab}
                        onClick={this.handleTabChange}/>
                        {
                            (currentTab === this.tabs[0]) && 
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
                                    hideOptionMenu={true}
                                    headerIconSpan={ sameUser ? 4 : 3 }/>
                                </React.Fragment>
                                
                            )
                            
                        }
                        {
                            (currentTab === this.tabs[1]) && 
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
                            (currentTab === this.tabs[2]) && 
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
                </div>
            </div>
         );
    }
}
 
export default ProfilePage;