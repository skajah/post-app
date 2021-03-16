import React, { Component } from 'react';
import Arrow from '../common/icons/arrow';
import UserContext from '../../context/userContext';
import ProfilePic from '../common/profilePic';
import { EditRow, EditRowWithFile } from './editRow';
import { compress, readMedia } from '../../utils/media';
import { updateMe } from '../../services/userService';


class ProfileEdit extends Component {
    static contextType = UserContext;

    goToUpdate = page => {
        this.props.history.push(`/profile/edit/${page}`);
    }

    handleProfilePicUpload = async file => {
        try {
            const profilePic = await readMedia(file);
            this.context.updateUser('profilePic', profilePic);
            await updateMe({ profilePic: compress(profilePic) });
        } catch (ex) {
            if (ex.response)
                console.log('Error: ', ex.response);
            else
                console.log('Error: ', ex);
        }
        

    }

    render() { 
        // console.log('profileEdit render()');
        const { email, username, description, profilePic } = this.context.currentUser;

        return ( 
            <div className="profile-summary center">
                <div className="profile-summary-header">
                    <p style={{width: '100%', fontSize: '1.5rem', fontWeight: 500}}>My Profile</p>
                </div>
                <EditRowWithFile
                label="Photo"
                text="Your photo will be shown on your posts and comments"
                icon={<ProfilePic src={profilePic} />}
                className="profile-summary-photo clickable"
                extensions={['jpg', 'jpeg', 'gif', 'png']}
                maxFileSize={10}
                onFileChosen={this.handleProfilePicUpload}
                />
                
                <EditRow 
                label="Username"
                text={ username }
                icon={<Arrow direction="right" disabled={true}/>}
                className="profile-summary-username clickable"
                onClick={() => this.goToUpdate('username')}
                />
                <EditRow 
                label="Email"
                text={ email }
                icon={<Arrow direction="right" disabled={true}/>}
                className="profile-summary-email clickable"
                onClick={() => this.goToUpdate('email')}
                />
                <EditRow 
                label="Description"
                text={ description }
                icon={<Arrow direction="right" disabled={true}/>}
                className="profile-summary-description clickable"
                onClick={() => this.goToUpdate('description')}
                />

                <EditRow 
                label="Password"
                text="Click to change"
                icon={<Arrow direction="right" disabled={true}/>}
                className="profile-summary-password clickable"
                onClick={() => this.goToUpdate('password')}
                />
                
            </div>
         );
    }
}
 
export default ProfileEdit;