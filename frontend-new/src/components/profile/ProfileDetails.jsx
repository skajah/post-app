import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProfilePic from '../common/ProfilePic';
import UserContext from '../../context/UserContext';
import Button from '../common/Button';
import { FaPencilAlt } from 'react-icons/fa';


class ProfileDetails extends Component {
    static contextType = UserContext;

    render() { 
        const { user, onFollow } = this.props;
        const { currentUser } = this.context;
        return (
            <div className="profile-details">
                <div className="content-details">
                    <ProfilePic src={ user.profilePic } onClick={() => {}}/>
                    <span className="username">{ user.username }</span>
                    {
                    currentUser._id === user._id && 
                    <Link to="/profile/edit"> 
                        <FaPencilAlt />
                    </Link>
                    }
                </div>
                <Button 
                styles={['outline']}
                size="small"
                onClick={onFollow}>
                    { currentUser.following[user._id] ? 'Unfollow' : 'Follow' }
                </Button>
            </div>
        );
    }
}
 
export default ProfileDetails;