import React, { Component } from 'react';
import ProfilePic from './profilePic';
import DeleteIcon from './icons/deleteIcon';

class ContentDetails extends Component {
    render() { 
        const { details, profilePicUrl, onDelete } = this.props;
        // console.log(profilePicUrl, comment);
        const { username, date } = details;
        return ( 
            <div className="row content-details">
                <div className="col-11">
                    <ProfilePic src={profilePicUrl}/>
                    <span className="name">{username}</span>
                    <span className="date text-muted">{date.toDateString()}</span>
                </div>
                <div className="col-1">
                    <DeleteIcon onDelete={onDelete}/>
                </div>
            </div>
         );
    }
}
 
export default ContentDetails;