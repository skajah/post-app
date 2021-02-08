import { Component } from 'react'

class Icon extends Component {
    state = {
        classes: ''
    }

    getClasses = () => {
        const { size } = this.props;
        return this.state.classes + (size ? ` fa-${size}` : '');
    }

    renderIcon() {
        const { onClick, disabled } = this.props;
        const icon = <i className={this.getClasses()}/>
        return (
            disabled ? icon :
            <button className="btn" onClick={onClick}>
                { icon }
            </button>
        );
    }

    render(){
        return this.renderIcon();
    }
}
 
export default Icon;