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
                    <span className="name">{username}</span>
                    <span className="date text-muted">{date.toDateString()}</span>
                </div>
                <div className="col-1">
                    <Like onClick={onLike} likes={likes}/>
                </div>
                <div className="col-1">
                    <Delete onClick={onDelete}/>
                </div>
            </div>
         );
    }
}
 
export default ContentDetails;