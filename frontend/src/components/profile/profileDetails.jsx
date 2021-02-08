import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Pen from '../common/icons/pen';
import ProfilePic from '../common/profilePic';
import { getCurrentUser } from '../../services/authService';


class ProfileDetails extends Component {
    render() { 
        const user = getCurrentUser();
        return ( 
            <div className="profile-details">
                <div>
                    <ProfilePic />
                    <span className="profile-username">{ user.username }</span>
                </div>
                <Link to="/profile/edit"> <Pen size="lg"/> </Link>
            </div>
         );
    }
}
 
export default ProfileDetails;