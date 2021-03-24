
import Icon from './icon';

class Dots extends Icon {
    state = {
        classes: "fa fa-ellipsis-h"
    }

    renderIcon(){
        let { classes } = this.state;
        const { onClick } = this.props;
        if (this.props.vertical && classes[classes.length - 1] !== 'v'){
            classes = "fa fa-ellipsis-v";
            this.setState({ classes });
        }
        return (
            <i className={this.getClasses() + " clickable"} onClick={onClick} />
        )
    }
}

export default Dots;