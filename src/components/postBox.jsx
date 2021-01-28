import React, { Component } from 'react';
import ProfilePic from './common/profilePic';
import TextBox from './common/textBox';
import Camera from './common/icons/camera';
import VideoCamera from './common/icons/videoCamera';
import Volume from './common/icons/volume';
import withAlert from './hoc/withAlert';
import Media from './common/media';

class CreatePostBox extends Component {
    render() { 
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";
        const { 
            text, 
            media,
            onClearMedia,
            onTextChange, 
            onCreatePost, 
            onUploadImage, 
            onUploadVideo, 
            onUploadAudio } = this.props;

        return ( 
            <div className="card bg-light create-post-box">
                <div className="card-header create-post-header">
                    <ProfilePic src={url}/>  
                    <button 
                    className="btn btn-danger"
                    onClick={onClearMedia}
                    disabled={ !media }>Clear Media</button>
                </div>
                <div className="card-body">
                    <TextBox 
                    name="postText"
                    placeHolder=" What's on your mind?"
                    value={text}
                    onTextChange={onTextChange}
                    className="post-text-box"/>

                    { media && <Media type={media.type} src={media.src}/> }

                </div>
                <div className="card-footer create-post-footer">
                    <span className="upload-icons">
                        <Camera 
                        extensions={['jpg', 'jpeg', 'png', 'gif']}
                        onFileChosen={onUploadImage}
                        maxFileSize={10}/>

                        <VideoCamera 
                        extensions={['mp4', 'mov', 'mpg']}
                        onFileChosen={onUploadVideo}
                        maxFileSize={10}/>

                        <Volume
                        extensions={['mp3', 'wav', 'ogg']}
                        onFileChosen={onUploadAudio}
                        maxFileSize={10}/>
                    </span>
                    
                    <button 
                    className="btn btn-secondary" 
                    onClick={onCreatePost}>Post</button>
                </div>
            </div>
         );
    }
}
 
export default withAlert(CreatePostBox);