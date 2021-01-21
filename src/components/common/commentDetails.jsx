import React, { Component } from 'react';
import ContentDetails from './contentDetails';


class CommentDetails extends Component {
    render() { 
        const { comment, profilePicUrl, onDelete } = this.props;
        const { username, date, text } = comment;
        return ( 
            <div>
                <ContentDetails 
                username={username}
                date={date.toDateString()}
                profilePicUrl={profilePicUrl}
                onDelete={onDelete}
                />
                <p className="comment-text">{text}</p>
            </div>
         );
    }
}
 
export default CommentDetails;