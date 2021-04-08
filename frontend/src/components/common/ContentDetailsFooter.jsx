import { number } from 'prop-types';
import React from 'react';
import Comment from './icons/comment';
import Like from './icons/like';
import Delete from './icons/delete';

function ContentDetailsFooter({
    numberOfComments,
    likes,
    initialLike,
    onLike,
    onDelete
}) {
    return (
        <div className="content-details-footer" 
        style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <Comment numberOfComments={numberOfComments} disabled={true}/>
            <Like likes={likes} initialLike={initialLike} onClick={onLike}/>
            { onDelete &&
                <Delete onClick={onDelete}/>
            }
        </div>
    )
}

export default ContentDetailsFooter

