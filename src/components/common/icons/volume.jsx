import Icon from './icon';
import withFileChooser from '../../hoc/withFileChooser';

class Volume extends Icon {
    state = {
        classes: "fa fa-volume-up"
    }
}
 
export default withFileChooser(Volume);