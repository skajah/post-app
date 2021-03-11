
import Icon from './icon';

class Arrow extends Icon {
    state = {
        classes: ''
    }

    componentDidMount() {
        const { direction, stem } = this.props;
        let classes = (stem ? "fa fa-arrow-" : "fa fa-chevron-") + direction;
        this.setState({ classes });
    }
}

export default Arrow;