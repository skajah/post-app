import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Posts from './posts';
import PostSearch from './postSearch';

import { getPosts, deletePost } from '../../services/postService';

import { filterByDateRange, filterByRelativeDate } from '../../utils/postFilters';
import { makeDates } from '../../utils/makeDate';

class PostsPage extends Component {
    state = {
        posts: null,
        keywordFilter: null,
        relativeDateFilter: null,
        dateRangeFilter: null,
    }

    relativeDates = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days']

    async componentDidMount() {
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
            if (ex.response && ex.response.status === 404)
                toast.error(<p>Post not found<br/>Try refreshing</p>);
            this.setState({ posts: originalPosts });
        }
    }

    handleCreatePost = (postText, media) => {
        const post = {
            username: 'Anonymous',
            date : new Date(),
            likes: 0,
            text: postText,
            // media,
        };

        const posts = [...this.state.posts];
        posts.unshift(post);
        this.setState({ posts });
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

    getPost = id => {
        return this.state.posts.find(p => p._id === id);
    }

    handlePostClick = ({ _id }) => {
        this.props.history.push(`/posts/${_id}`);
    }

    render() {  
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