import React, { Component } from 'react'
import { getPosts } from '../services/fakePostService';
import Post from './post';

class Posts extends Component {
    state = { 
        posts: []
     }

    componentDidMount(){
        const posts = getPosts();
        this.setState({ posts });
    }

    handleDelete = ({ _id }) => {
        const posts = this.state.posts.filter(post => post._id !== _id);
        this.setState({ posts });
    }

    render() { 
        const { posts } = this.state;
        return ( 
            <div className="posts">
                {
                    posts.length ?
                    posts.map(post => {
                        return <Post 
                        key={post._id} 
                        post={post}
                        onDelete={() => this.handleDelete(post)}/>;
                    }) : 
                    <h2>No posts yet :(</h2>
                }
            </div>
         );
    }
}
 
export default Posts;