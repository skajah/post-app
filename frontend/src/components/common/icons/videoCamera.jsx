import Icon from './icon';
import withFileChooser from '../../hoc/withFileChooser';

class VideoCamera extends Icon {
    state = {
        classes: "fa fa-video-camera"
    }
}
 
export default withFileChooser(VideoCamera);