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
            defaultValue={value}
            value={value}
            placeHolder={placeHolder}
            onChange={this.handleTextChange}
            {...rest}/>
        );
    }
    
    renderInput = (name, placeHolder, value, type, rest) => {
        return (
            <input
            type={type}
            name={name}
            defaultValue={value}
            value={value}
            placeHolder={placeHolder}
            onChange={this.handleTextChange}
            {...rest}/>
        );
    }

    render() { 
        const { name, placeHolder, label, value, type, ...rest } = this.props;
        console.log('textBox render()');

        return ( 
            type === 'textarea' ?
                this.renderTextArea(name, placeHolder, value, rest):
                this.renderInput(name, placeHolder, value, type, rest)
         );
    }
}
 
export default withAlert(TextBox);