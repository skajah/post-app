import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/userContext';
import Edit from '../common/icons/edit';
import ProfilePic from '../common/profilePic';


class ProfileDetails extends Component {
    static contextType = UserContext;

    render() { 
        const user = this.context.currentUser;
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