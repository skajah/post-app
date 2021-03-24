import React, { Component } from 'react';
import Dots from './icons/dots';

class Dropdown extends Component {
    state = { 
        showOptions: false
    }

    dropdown = React.createRef();

    componentDidMount(){
        document.addEventListener("mousedown", this.handleOutsideClick)
    }

    componentWillUnmount(){
        document.removeEventListener("mousedown", this.handleOutsideClick)
    }

    handleOutsideClick = event => {
        if (this.dropdown.current && !this.dropdown.current.contains(event.target))
            this.setState({ showOptions: false });
    }

    handleDropdown = () => {
        let { showOptions } = this.state;
        showOptions = !showOptions;
        this.setState({ showOptions });
    }

    handleOption = option => {
        this.setState({ showOptions: false });
        this.props.onOptionSelected(option);
    }

    render() { 
        const { options } = this.props;
        const { showOptions } = this.state;
        return ( 
            <div className="dropdown" ref={this.dropdown}>
                <Dots vertical={true} onClick={this.handleDropdown}/>
                <div className={`dropdown-content${showOptions ? ' show': ''}`}>
                    {
                        options.map(o => {
                        return <button 
                        className="btn"
                        onClick={() => this.handleOption(o)}
                        key={o}>
                            { o }
                        </button>
                        })
                    }
                </div>
            </div>
         );
    }
}
 
export default Dropdown;