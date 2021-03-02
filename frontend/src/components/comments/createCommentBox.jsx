import React, { Component } from 'react'
import TextBox from '../common/textBox';
import ProfilePic from '../common/profilePic';

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
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";
        const { alert } = this.props;
        const { clear } = this.state;

        return ( 
            <div className="create-comment-box">
                <ProfilePic // default style prop to make size 60x60
                src={url}/> 
                <div style={{
                    width: "100%", 
                    display: 'flex',
                    flexDirection: 'column'
                    }}>
                    <TextBox 
                    name="commentText"
                    placeHolder=" Comment on this post..."
                    value={clear ? '' : null}
                    className="text-box create-comment-text-box"
                    onTextChange={this.handleTextChange}
                    // Pass down alert so that it is aligned with text box
                    alert={alert}/> 
                    
                    <button 
                    className="btn btn-comment" 
                    style={{alignSelf: 'end'}}
                    onClick={this.handleCreate}>
                        Comment
                    </button>
                </div> 

            </div>
         );
    }
}
 
export default CreateCommentBox;