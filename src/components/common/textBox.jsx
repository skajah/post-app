import React, { Component } from 'react'

class TextBox extends Component {
    state = { 
        text: '',
     }
    
    handleTextChange = (e) => {
        const text = e.currentTarget.value;
        this.setState({ text });
        console.log('Current Text: ', text);
    };

    getText(){
        return this.state.text;
    }

    handleKeyPress = e => {
        const text = this.getText();

        if (e.key === 'Enter' && text){
            this.props.onEnter(text);
            this.setState({ text: '' });
        }
            
    }

    render() { 
        const { name, placeHolder, ...rest } = this.props;

        return ( 
            <input 
            type="text"
            name={name}
            id={name} // for css
            value={this.getText()}
            placeHolder={placeHolder}
            onChange={this.handleTextChange}
            onKeyPress={this.handleKeyPress}
            {...rest}
            />
         );
    }
}
 
export default TextBox;