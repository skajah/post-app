import React, { Component } from 'react'
import TextBox from '../common/textBox';
import ProfilePic from '../common/profilePic';
import './CreateCommentBox.css';
import Button from '../common/Button';

class CreateCommentBox extends Component {
    
    text = ''

    state = {
        clear: false
    }

    handleTextChange = text => {
        this.text = text;
        if (this.state.clear)
            this.setState({ clear: false });
    }

    handleCreate = () => {
        this.props.onCreate(this.text);
        this.text = '';
        this.setState({ clear: true });
    }

    render() { 
        const { alert } = this.props;
        const { clear } = this.state;

        return ( 
            <div className="create-comment-box">
                <TextBox 
                    name="commentText"
                    placeHolder=" Comment on this post..."
                    value={clear ? '' : null}
                    className="text-box create-comment-text-box"
                    onTextChange={this.handleTextChange}
                    // Pass down alert so that it is aligned with text box
                    type="textarea"
                    alert={alert}/>
                <Button
                color="primary"
                size="btn--small"
                onClick={this.handleCreate}>
                    Comment
                </Button>
            </div>
         );
    }
}
 
export default CreateCommentBox;