import React, { Component } from 'react'
import TextBox from './common/textBox';
import ProfilePic from './common/profilePic';

class CreateCommentBox extends Component {

    render() { 
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";
        const { text, onTextChange, emptyComment } = this.props;

        return ( 
            <div className="comment-box">
                <ProfilePic // default style prop to make size 60x60
                src={url}/> 
                <div style={{width: "100%"}}>
                    <TextBox 
                    name="commentText"
                    placeHolder=" Comment on this post..."
                    value={text}
                    className="comment-text-box"
                    onTextChange={onTextChange}/>

                    { emptyComment && 
                        <div className="alert alert-warning">Comment can't be empty</div>
                        }
                </div>
            </div>
         );
    }
}
 
export default CreateCommentBox;