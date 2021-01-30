import React, { Component } from 'react';
import _ from 'lodash';
import Posts from './posts';
import PostSearch from './postSearch';
import { getPosts } from '../services/fakePostService';

class PostPage extends Component {
    state = {
        posts: [],
        postFilter: null
    }

    componentDidMount() {
        this.setState({ posts: getPosts()});
    }

    handleDelete = ({ _id }) => {
        const posts = this.state.posts.filter(post => post._id !== _id);
        this.setState({ posts });
    }

    handleCreatePost = (postText, media) => {
        const post = {
            _id: this.getNextId(),
            username: 'Anonymous',
            date : new Date(),
            likes: 0,
            text: postText,
            media,
            comments: []
        };

        const posts = [...this.state.posts];
        posts.unshift(post);
        this.setState({ posts });
    }

    getNextId(){
        const { posts } = this.state;
        return (_.max(posts.map(p => p._id)) + 1) || 0;
    }

    handleSearchByKeyword = text => {
        const trimmed = text.trim().toLowerCase();
        const postFilter = !trimmed ? null : { keyword: trimmed };
        this.setState({ postFilter });
    }

    getCurrentPosts = () => {
        const { postFilter, posts } = this.state;
    
        // console.log(posts);

        if (!postFilter) return posts;

        

        const { keyword } = postFilter;

        if (keyword) 
            return posts.filter(p => p.username.toLowerCase().includes(keyword));

    }

    render() { 

        return ( 
            <div className="post-page">
                <Posts 
                    posts={this.getCurrentPosts()}
                    onDelete={this.handleDelete}
                    onCreatePost={this.handleCreatePost}/>
                <PostSearch searchByKeyword={this.handleSearchByKeyword}/>
            </div>
         );
    }
}
 
export default PostPage;