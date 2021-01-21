import React, { Component } from 'react'

class TextBox extends Component {
    render() { 
        const { name, value, placeHolder, onChange, onKeyPress, ...rest } = this.props;

        return ( 
            <input 
            type="text"
            name={name}
            id={name} // for css
            value={value}
            placeHolder={placeHolder}
            onChange={onChange}
            onKeyPress={onKeyPress}
            {...rest}
            />
         );
    }
}
 
export default TextBox;