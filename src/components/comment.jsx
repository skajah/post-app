import React, { Component } from 'react'
import ContentDetails from './common/contentDetails';

class Comment extends Component {
    render() { 
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";
        const { comment, onDelete } = this.props;
        // console.log('From Comment. Comment = ', comment);
        return ( 
            <div className="comment"> 
                <ContentDetails 
                details={comment} 
                profilePicUrl={url}
                onDelete={onDelete}
                />
                <p className="comment-text">{comment.text}</p>
            </div>
         );
    }
}
 
export default Comment;