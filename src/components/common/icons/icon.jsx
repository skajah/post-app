import { Component } from 'react'

class Icon extends Component {
    state = {
        classes: ''
    }

    renderIcon() {
        return (
        <button className="btn" onClick={this.props.onClick}>
            <i className={this.state.classes}/>
        </button>
        );
    }

    render(){
        return this.renderIcon();
    }
}
 
export default Icon;