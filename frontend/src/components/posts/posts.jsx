import React, { Component } from 'react';
import Post from './post';

class Posts extends Component {

    render() { 
        const { posts, onDelete, onPostClick, onProfile, hideOptionMenu, headerIconSpan } = this.props;

        return ( 
            <div className="posts">
                {
                    posts.map(post => {
                        return <Post 
                        key={post._id} 
                        post={post}
                        onDelete={() => onDelete(post)}
                        onPostClick={() => onPostClick(post)}
                        onProfile={() => onProfile(post.user._id)}
                        hideOptionMenu={hideOptionMenu}
                        headerIconSpan={headerIconSpan}/>;
                    }) 
                }
            </div>
         );
    }
}
 
export default Posts;