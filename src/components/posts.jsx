import React, { Component } from 'react';
import _ from 'lodash';
import { getPosts } from '../services/fakePostService';
import Post from './post';
import CreatePostBox from './postBox';

class Posts extends Component {
    state = { 
        posts: [],
        postText: '',
        emptyPost: false,
        media: null,
     }

    componentDidMount(){
        const posts = getPosts();
        this.setState({ posts });
    }

    handleDelete = ({ _id }) => {
        const posts = this.state.posts.filter(post => post._id !== _id);
        this.setState({ posts });
    }

    handlePostTextChange = postText => {
        this.setState({ postText });
    }

    handleCreatePost = () => {
        const text = this.state.postText;
        if (!text.trim()) {
            this.setState({ emptyPost: true });
            return;
        }
        const posts = [...this.state.posts];
        const post = {
            _id: this.getNextId(),
            username: 'Anonymous',
            date : new Date(),
            likes: 0,
            text: this.state.postText,
            media: null,
            comments: []
        };
        posts.unshift(post);
        this.setState({ posts, postText: '', emptyPost: false });
    }

    getNextId(){
        const { posts } = this.state;
        return (_.max(posts.map(p => p._id)) + 1) || 0;
    }

    render() { 
        const { posts } = this.state;
        return ( 
            <div className="posts">
                <CreatePostBox 
                text={this.state.postText}
                onTextChange={this.handlePostTextChange} 
                onCreatePost={this.handleCreatePost}
                warning={this.state.emptyPost && "Post can't be empty"}/>

                {
                    posts.map(post => {
                        return <Post 
                        key={post._id} 
                        post={post}
                        onDelete={() => this.handleDelete(post)}/>;
                    }) 
                }
            </div>
         );
    }
}
 
export default Posts;