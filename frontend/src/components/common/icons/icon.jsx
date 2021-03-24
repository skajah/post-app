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
        const icon = disabled ? 
        <i className={this.getClasses()}/> : 
        <i className={this.getClasses() + " clickable"}
        onClick={onClick}/>
        return icon;
    }

    render(){
        return this.renderIcon();
    }
}
 
export default Icon;