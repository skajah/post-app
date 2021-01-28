import React, { Component } from 'react';
import Delete from './icons/delete';
import Like from './icons/like';
import ProfilePic from './profilePic';

class ContentDetails extends Component {
    render() { 
        const { details, profilePicUrl, onDelete, onLike, likes } = this.props;
        // console.log(profilePicUrl, comment);
        const { username, date } = details;
        return ( 
            <div className="row content-details">
                <div className="col-10">
                    <ProfilePic src={profilePicUrl}/>
                    <div>
                        <span className="post-username">{username}</span>
                        <span className="post-time">{date.toLocaleTimeString()}</span>
                        <br/>
                        <span className="post-date">{date.toDateString()}</span>
                    </div>
                </div>
                <div className="col-2">
                    <Like onClick={onLike} likes={likes}/>
                    <Delete onClick={onDelete}/>
                </div>
            </div>
         );
    }
}
 
export default ContentDetails;