import React, { Component } from 'react'
import CommentDetails from './common/commentDetails';

class Comment extends Component {
    render() { 
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";
        const { comment, onDelete } = this.props;
        return ( 
            <div className="comment"> 
                <CommentDetails 
                comment={comment}
                profilePicUrl={url}
                onDelete={onDelete}
                />
            </div>
         );
    }
}
 
export default Comment;