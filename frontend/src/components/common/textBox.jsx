import React, { Component } from 'react'
import withAlert from '../hoc/withAlert';

class TextBox extends Component {

    handleTextChange = (e) => {
        const text = e.currentTarget.value;
        this.props.onTextChange(text);
        // console.log('Current Text: ', text);
    };

    renderTextArea = (name, placeHolder, value, rest) => {
        return (
            <textarea
            name={name}
            value={value}
            placeHolder={placeHolder}
            onChange={this.handleTextChange}
            {...rest}/>
        );
    }
    
    renderInput = (name, placeHolder, value, rest) => {
        return (
            <input
            type="text"
            name={name}
            value={value}
            placeHolder={placeHolder}
            onChange={this.handleTextChange}
            {...rest}/>
        );
    }

    render() { 
        const { name, placeHolder, value, type, ...rest } = this.props;

        return ( 
            type === 'input' ? 
            this.renderInput(name, placeHolder, value, rest) :
            this.renderTextArea(name, placeHolder, value, rest)
         );
    }
}
 
export default withAlert(TextBox);