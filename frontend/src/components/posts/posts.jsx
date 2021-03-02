import React, { Component } from 'react';
import Post from './post';

class Posts extends Component {

    render() { 
        const { posts, onDelete, onPostClick } = this.props;

        return ( 
            <div className="posts">
                {
                    posts.map(post => {
                        return <Post 
                        key={post._id} 
                        post={post}
                        onDelete={() => onDelete(post)}
                        onPostClick={() => onPostClick(post)}/>;
                    }) 
                }
            </div>
         );
    }
}
 
export default Posts;