import React from 'react';
import Post from './Post';
import Button from '../common/Button';

export default function Posts({
    posts,
    onFollow,
    onLike,
    onPostClick,
    onProfileClick,
    onDelete,
    onLoadMore,
    loadMore
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
                        onDelete={onDelete}
                        onFollow={onFollow}
                        onLike={onLike}/>
                    )
                })
            }
            {
                loadMore &&
                <div className="load-more-container">
                    <Button
                    color="secondary"
                    size="small"
                    onClick={onLoadMore}>
                        Load More
                    </Button>
                </div>
            }       
        </div>
    )
}
