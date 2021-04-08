import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Edit from '../common/icons/edit';
import ProfilePic from '../common/profilePic';
import UserContext from '../../context/userContext';
import Button from '../common/Button';

class ProfileDetails extends Component {
    static contextType = UserContext;

    render() { 
        const { user, onFollow } = this.props;
        const { currentUser } = this.context;
        return ( 
            <div className="profile-details">
                <div>
                    <ProfilePic src={ user.profilePic } />
                    <span className="username">{ user.username }</span>
                    {
                    currentUser._id === user._id && 
                    <Link to="/profile/edit"> <Edit size="lg"/> </Link>
                    }
                </div>
                <Button
                color="whitesmoke"
                size="btn--xsmall"
                onClick={onFollow}>
                    {
                        currentUser.following[user._id] ? 'Unfollow' : 'Follow'
                    }
                </Button>
                
            </div>
         );
    }
}
 
export default ProfileDetails;