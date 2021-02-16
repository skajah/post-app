import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Edit from '../common/icons/edit';
import ProfilePic from '../common/profilePic';
import { getCurrentUser } from '../../services/authService';


class ProfileDetails extends Component {
    render() { 
        const user = getCurrentUser();
        return ( 
            <div className="profile-details">
                <div>
                    <ProfilePic />
                    <span className="username">{ user.username }</span>
                </div>
                <Link to="/profile/edit"> <Edit size="lg"/> </Link>
            </div>
         );
    }
}
 
export default ProfileDetails;