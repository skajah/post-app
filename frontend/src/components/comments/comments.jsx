import React from 'react';
import Comment from './Comment';
import Button from '../common/Button';

export default function Comments({
    comments,
    onDelete,
    onProfileClick,
    onFollow,
    loadMore,
    onLoadMore
}) {
    return (
        <div className="comments">
            {
                comments.map(comment => {
                    return (
                        <Comment
                        key={comment._id} 
                        comment={comment}
                        onDelete={onDelete}
                        onProfileClick={onProfileClick}
                        onFollow={onFollow}
                        />
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
