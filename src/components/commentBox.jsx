import React, { Component } from 'react'
import TextBox from './common/textBox';
import ProfilePic from './common/profilePic';

class CreateCommentBox extends Component {
    state = { 
        profilePic: null,
        text: '',
     }
    
    handleTextChange = (e) => {
        const text = e.currentTarget.value;
        this.setState({ text });
    };

    handleEnterKey = e => {
        const text = this.getText();

        if (e.key === 'Enter' && text){
            console.log('Text entered: ', text);
            this.setState({ text: '' });
        }
            
    }

    getText(){
        return this.state.text;
    }

    render() { 
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";

        return ( 
            <div className="comment-box">
                <ProfilePic // default style prop to make size 60x60
                src={url}/> 

                <TextBox 
                name="commentText"
                value={this.getText()}
                placeHolder="Comment on this post..."
                onChange={this.handleTextChange}
                onKeyPress={this.handleEnterKey}
                className="text-box"/>

            </div>
         );
    }
}
 
export default CreateCommentBox;