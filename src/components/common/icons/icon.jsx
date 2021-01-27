import { Component } from 'react'

class Icon extends Component {
    clickable = 'clickable'
    state = {
        classes: ''
    }

    getClasses = () => {
        return `${this.state.classes} ${this.clickable}`;
    }

    renderIcon() {
        return <i className={this.getClasses()}
                  onClick={this.props.onClick}
                  />;
    }

    render(){
        return this.renderIcon();
    }
}
 
export default Icon;