import React, { Component } from 'react';
import ProfilePic from './profilePic';
import DeleteIcon from './icons/deleteIcon';

class ContentDetails extends Component {
    render() { 
        const { username, date, profilePicUrl, onDelete } = this.props;
        return ( 
            <div className="content-details">
                <ProfilePic 
                src={profilePicUrl}/>

                <p className="name-date">
                    <span className="name">{username}</span> <br/>
                    <span className="date text-muted"> {date}</span>
                </p>

                <DeleteIcon 
                onDelete={onDelete}/>
            </div>
         );
    }
}
 
export default ContentDetails;