import React, { Component } from 'react'

class ProfilePic extends Component {
    render() { 
        const { src, alt } = this.props;

        return ( 
            <img
                src={src} 
                className="img-cirlce profile-pic" 
                alt={alt || 'Profile Pic'}
            />
         );
    }
}
 
export default ProfilePic;