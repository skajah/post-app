import React, { Component } from 'react';
import ProfilePic from '../common/profilePic';
import UserContext from '../../context/userContext';

class ProfileSimple extends Component {
    static contextType = UserContext;

    render() { 
        const { user, onClick } = this.props;
        return ( 
            <div 
            className="profile-simple clickable"
            onClick={() => onClick(user._id)}>
                <ProfilePic src={user.profilePic} />
                <span>{ user.username }</span>
            </div>
         );
    }
}
 
export default ProfileSimple;