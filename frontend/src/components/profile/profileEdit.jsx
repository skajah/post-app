import React, { Component } from 'react';
import Arrow from '../common/icons/arrow';
import UserContext from '../../context/userContext';
import { updateMe } from '../../services/userService';


class ProfileEdit extends Component {
    static contextType = UserContext;

    goToUpdate = page => {
        this.props.history.push(`/profile/edit/${page}`);
    }

    render() { 
        // console.log('profileEdit render()');
        const { email, username, description } = this.context.currentUser;

        return ( 
            <div className="profile-summary center">
                <div className="profile-summary-header">
                    <p style={{width: '100%', fontSize: '1.5rem', fontWeight: 500}}>My Profile</p>
                </div>
                <div className="profile-summary-photo clickable">
                    <span>Photo</span>
                    <span>Your photo will be shown on your posts and comments</span>
                    <span>Picture</span>
                </div>
                <div 
                className="profile-summary-username clickable"
                onClick={() => this.goToUpdate('username')}>
                    <span>Username</span>
                    <span>{ username }</span>
                    <Arrow direction="right" disabled={true}/>
                </div>
                <div 
                className="profile-summary-email clickable"
                onClick={() => this.goToUpdate('email')}>
                    <span>Email</span>
                    <span>{ email }</span>
                    <Arrow direction="right" disabled={true}/>
                </div>
                <div 
                className="profile-summary-description clickable"
                onClick={() => this.goToUpdate('description')}>
                    <span>Description</span>
                    <span>{ description }</span>
                    <Arrow direction="right" disabled={true}/>
                </div>
                <div 
                className="profile-summary-password clickable"
                onClick={() => this.goToUpdate('password')}>
                    <span>Password</span>
                    <span>Click to change</span>
                    <Arrow direction="right" disabled={true}/>
                </div>
            </div>
         );
    }
}
 
export default ProfileEdit;