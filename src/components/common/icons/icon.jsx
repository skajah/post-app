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

        return (
        <button className="btn" disabled={disabled} onClick={onClick}>
            <i className={this.getClasses()}/>
        </button>
        );
    }

    render(){
        return this.renderIcon();
    }
}
 
export default Icon;