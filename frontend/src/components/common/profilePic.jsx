import Media from './media';

class ProfilePic extends Media {
    render() { 
        const { src, alt } = this.props;
        const altSrc = "https://www.pngkey.com/png/detail/115-1150152_default-profile-picture-avatar-png-green.png";

        const attr = {className: 'profile-pic', alt: alt || 'Profile pic'};

        return this.renderMedia('image', src || altSrc, attr);
    }
}
 
export default ProfilePic;