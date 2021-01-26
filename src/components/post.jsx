import React, { Component } from 'react'
import Comments from './comments';
import ContentDetails from './common/contentDetails';
import CreateCommentBox from './commentBox';
import _ from 'lodash';
import Media from './common/media';
import { getLikes } from '../utils/getLikes';

class Post extends Component {
    state = { 
        username: 'Anonymous',
        date: new Date(),
        text: '',
        commentText: '',
        media: null,
        comments: []
    } 
    componentDidMount() {
        this.populateState();
    }

    populateState(){
        const { username, date, text, media, comments, likes } = this.props.post;
        this.setState({ username, date, text, media, comments,  likes: likes || 0});
    }

    handleDeleteComment = ({ _id }) => {
        // console.log('Deleting: ' + _id);
        const comments  = this.state.comments.filter(c => c._id !== _id );
        this.setState({ comments });
    }

    handleCreateComment = text => {
        // console.log('Handling creation: ', text);
        const comments = [...this.state.comments];
        const nextId = (_.max(comments.map(c => c._id)) + 1) || 0;
        const newComment = { _id: nextId, username: 'User' + nextId, date: new Date(), text};
        comments.push(newComment);
        this.setState({ comments });
    }

    handleLike = (liked) => {
        const likes = getLikes(this.state.likes, liked);
        this.setState({ likes });
    }
    
    handleCommentTextChange = commentText => {
        const n = commentText.length;
        if (commentText[n - 1] === '\n'){
            this.handleCreateComment(commentText.substring(0, n))
            this.setState({ commentText: '' });
            return;
        } 
        this.setState({ commentText });
    }

    render() { 
        const { text, media, likes } = this.state;
        const { onDelete } = this.props;
        const url = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80";

        return ( 
            <div className="card bg-light post">
                <div className="card-header">
                    <ContentDetails 
                    details={this.state}
                    profilePicUrl={url}
                    onDelete={onDelete}
                    onLike={this.handleLike}
                    likes={likes}/> 
                </div>
                <div className="card-body">
                    <p>{text}</p> 
                    {
                        media ? 
                        <Media 
                        type={media.type}
                        src={media.src}
                        controls={media.controls}/> : 
                        null
                    }
                    <Comments 
                    comments={this.state.comments}
                    onDelete={this.handleDeleteComment}/>
                </div>

                <div className="card-footer">
                    <CreateCommentBox 
                    text={this.state.commentText}
                    onTextChange={this.handleCommentTextChange}/>
                </div>
            </div>
         );
    }
}
 
export default Post;