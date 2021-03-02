import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ProfileDetails from './profileDetails';
import TabNav from '../common/tabNav';
import UserContext from '../../context/userContext';
import Posts from '../posts/posts';

import { getMyPosts, deletePost } from '../../services/postService';
import { makeDates } from '../../utils/makeDate';

class ProfilePage extends Component {
    static contextType = UserContext;

    state = {
        currentTab: 'My Posts',
        posts: null
    }

    tabs = ['My Posts', 'Following', 'Followers']

    componentDidMount(){
        // console.log('profilePage componentDidMount()');
        this.setMyPosts();
    }

    handleTabChange = tab => {
        this.setState({ currentTab: tab })

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

    setMyPosts = async () => {
        try {
            const { data: posts } = await getMyPosts();
            makeDates(posts);
            this.setState({ posts });
        } catch (ex) {
            // REVISIT
            console.log('Error: ', ex);
        }
    }

    render() { 
        // console.log('profilePage render()');
        const { currentTab, posts } = this.state;

        return ( 
            <div className="profile-page">
                <div className="card center">
                    <div className="card-header"> <ProfileDetails /> </div>
                    <div className="card-body">
                        <TabNav 
                        tabs={this.tabs}
                        currentTab={currentTab}
                        onClick={this.handleTabChange}/>
                        {
                            (currentTab === 'My Posts') && 
                            (
                                !posts ? <p className="center">Loading posts...</p> :
                                <Posts 
                                posts={posts}
                                onDelete={this.handleDelete}
                                onPostClick={this.handlePostClick}
                                />
                            )
                            
                        }
                    </div>
                </div>
            </div>
         );
    }
}
 
export default ProfilePage;