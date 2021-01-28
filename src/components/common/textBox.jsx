import React, { Component } from 'react'
import withAlert from '../hoc/withAlert';

class TextBox extends Component {

    handleTextChange = (e) => {
        const text = e.currentTarget.value;
        this.props.onTextChange(text);
        // console.log('Current Text: ', text);
    };

    render() { 
        const { name, placeHolder, value, ...rest } = this.props;

        return ( 
            <textarea
            name={name}
            id={name} // for css
            value={value}
            placeHolder={placeHolder}
            onChange={this.handleTextChange}
            {...rest}
            />
         );
    }
}
 
export default withAlert(TextBox);