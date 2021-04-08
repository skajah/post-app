import React, { Component } from 'react';
import ProfilePic from './profilePic';
import './ContentDetailsHeader.css';
import Dropdown from './Dropdown';
import UserContext from '../../context/userContext';
import { updateMe } from '../../services/userService';

class ContentDetailsHeader extends Component {
    static contextType = UserContext;

    handleFollow = async (id) => {
        const isFollowing = this.context.currentUser.following[id] ? true : false;
        await updateMe({ following: { id, follow: !isFollowing } })
        this.context.onFollow(id)
    }

    handleOptionSelected = option => {
        const { userId } = this.props.details;
        switch (option) {
            case 'Follow':
            case 'Unfollow':
                this.handleFollow(userId);
                break;
            case 'Profile':
                this.props.onProfile(userId);
                break;
            case 'Delete':
                this.props.onDelete();
                break;
            default:
                break;
        }
    }

    render() {
        const { details, onProfile, onPostClick, hideOptionMenu } = this.props;
        const { userId, username, date, profilePic } = details;
        const { currentUser } = this.context;
        const options = [
            'Profile', 
            currentUser.following[userId] ? 'Unfollow' : 'Follow'
        ];
        if (currentUser._id === userId)
            options.push('Delete');

        return (
            <div className="content-details-header">
                <span onClick={() => onProfile(userId)} className="clickable">
                    <ProfilePic src={profilePic}/>
                </span>
                
                <div className={`date-time ${onPostClick && 'clickable'}`} onClick={onPostClick}>   
                    <span className="username">{username}</span>    
                    <br/>
                    <span className="date">{date.toDateString()}</span>
                </div>
                {
                    !hideOptionMenu && 
                    <Dropdown options={options} onOptionSelected={this.handleOptionSelected}/>
                }
            </div>
        )
    }
}

// <span className="time">{date.toLocaleTimeString()}</span>

export default ContentDetailsHeader

