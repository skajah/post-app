import Media from './media';
import profileDefault from '../../images/profile_default.jpg';

class ProfilePic extends Media {
    render() { 
        const { src, alt } = this.props;

        const attr = {className: 'profile-pic', alt: alt || 'Profile pic'};

        return this.renderMedia('image', src || profileDefault, attr);
    }
}
 
export default ProfilePic;