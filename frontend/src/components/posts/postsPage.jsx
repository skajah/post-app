import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Posts from './posts';
import PostSearch from './postSearch';

import { getPosts, deletePost, createPost } from '../../services/postService';

import { filterByDateRange, filterByRelativeDate } from '../../utils/postFilters';
import { makeDate, makeDates } from '../../utils/makeDate';

import UserContext from '../../context/userContext';

class PostsPage extends Component {
    static contextType = UserContext;

    state = {
        posts: null,
        keywordFilter: null,
        relativeDateFilter: null,
        dateRangeFilter: null,
    }

    relativeDates = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days']

    componentDidMount() {
        // console.log('postsPage componentDidMount()');
        this.populatePosts();
    }

    populatePosts = async () => {
        try {
            const { data: posts } = await getPosts({ numberOfComments: true });
            makeDates(posts);
            this.setState({ posts });
        } catch (ex) {
            // Axios will catch any unexpected erros
        }
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

    handleCreatePost = async (postText, media) => {
        const newPost = {
            userId: this.context.currentUser._id,
            // date : new Date(), // should default to now
            likes: 0,
            text: postText,
            // media,
        };

        try {
            const { data: post } = await createPost(newPost);
            makeDate(post)
            const posts = [...this.state.posts];
            posts.unshift(post);
            this.setState({ posts });
        } catch (ex) {
            // REVISIT
        }
    }

    handleSearchByKeyword = text => { 
        const trimmed = text.trim().toLowerCase();
        this.setState({ keywordFilter: trimmed, 
                        relativeDateFilter: null, 
                        dateRangeFilter: null 
                    });
    }

    handleDateSelected = date => {
        this.setState({ keywordFilter: null, 
                        relativeDateFilter: date, 
                        dateRangeFilter: null 
                    });
    }

    handleDateRange = (start, end) => {
        this.setState({ keywordFilter: null,
                        relativeDateFilter: null,
                        dateRangeFilter: [start, end] 
                    });
    }

    getCurrentPosts = () => {
        const { 
            keywordFilter, 
            relativeDateFilter, 
            dateRangeFilter, 
            posts } = this.state;

        if (keywordFilter) 
            return posts.filter(p => p.user.username.toLowerCase().includes(keywordFilter));
        
        if (relativeDateFilter)
            return filterByRelativeDate(posts, relativeDateFilter);
        
        if (dateRangeFilter){
            const [start, end] = this.state.dateRangeFilter;
            return filterByDateRange(posts, start, end);
        }

        // console.log('Current posts: ', posts);
        return posts;
    }

    handlePostClick = ({ _id }) => {
        this.props.history.push(`/posts/${_id}`);
    }

    render() {  
        // console.log('postsPage render()');
        const { relativeDateFilter, posts } = this.state;

        if (!posts) return <p className="center">Loading posts...</p>;

        return (
            <div className="posts-page">
                    <Posts 
                        posts={this.getCurrentPosts()}
                        onDelete={this.handleDelete}
                        onCreatePost={this.handleCreatePost}
                        onPostClick={this.handlePostClick}/>
                    <PostSearch 
                        searchByKeyword={this.handleSearchByKeyword}
                        dates={this.relativeDates}
                        selectedDate={relativeDateFilter}
                        onDateSelected={this.handleDateSelected}
                        onDateRange={this.handleDateRange}/>
            </div>
        );
  
    }
}
 
export default PostsPage;