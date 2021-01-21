import React from 'react'
import Media from './media';

class ProfilePic extends Media {
    render() { 
        
        const { src, alt } = this.props;
        const attr = {className: 'profile-pic', alt: alt || 'Profile pic'};

        return this.renderMedia('image', src, attr);
    }
}
 
export default ProfilePic;