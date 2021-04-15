import React from 'react';
import Post from './Post';
import Button from '../common/Button';

export default function Posts({
    posts,
    onPostClick,
    onProfileClick,
    onDelete
}){
    return (
        <div className="posts">
            {
                posts.map(post => {
                    return (
                        <Post 
                        key={post._id}
                        post={post}
                        onPostClick={onPostClick}
                        onProfileClick={onProfileClick}
                        onDelete={onDelete}/>
                    )
                })
            }
            {
                posts.length > 10 &&
                <div 
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '25px'
                }}>
                    <Button
                    color="secondary"
                    size="small">
                        Load More
                    </Button>
                </div>
            }       
        </div>
    )
}
