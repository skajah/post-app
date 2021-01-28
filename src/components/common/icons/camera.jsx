import Icon from './icon';
import withFileChooser from '../../hoc/withFileChooser';

class Camera extends Icon {
    state = {
        classes: "fa fa-camera"
    }
}
 
export default withFileChooser(Camera);