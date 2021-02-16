import React, { Component } from 'react'
import { toast } from 'react-toastify';
import Comments from '../comments/comments';
import CreateCommentBox from '../comments/createCommentBox';
import ContentDetails from '../common/contentDetails';
import _ from 'lodash';
import Media from '../common/media';
import { getLikes } from '../../utils/getLikes';
import { getUserFromId } from '../../services/userService';

class Post extends Component {
    state = { 
        user: {},
        date: new Date(),
        text: '',
        media: null,
        comments: [],
        numberComments: 0,
        likes: 0,
        commentText: '',
        emptyComment: false,
    } 
    componentDidMount() {
        this.populateState();
    }

    async populateState(){
        const { userId, date, text, media, comments, numberComments, likes } = this.props.post;
        try {
            const { data: user } = await getUserFromId(userId);
            this.setState({ 
                user, 
                date: date || new Date(), 
                text, 
                media, 
                comments: comments || [],
                numberComments: numberComments || 0,
                likes: likes || 0,
            });
        } catch (ex) {
            toast.error(ex.message);
        }
        
    }

    handleDeleteComment = ({ _id }) => {
        // console.log('Deleting: ' + _id);
        const comments  = this.state.comments.filter(c => c._id !== _id );
        this.setState({ comments });
    }

    handleCreateComment = text => {
        if (!text.trim()){
            this.setState({ emptyComment: true });
            return;
        }

        const comments = [...this.state.comments];
        const nextId = (_.max(comments.map(c => c._id)) + 1) || 0;
        const newComment = { _id: nextId, username: 'User' + nextId, date: new Date(), text};
        comments.unshift(newComment);
        this.setState({ comments, emptyComment: false });
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
        const { onDelete, showComments, onPostClick } = this.props;
        const url = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80";
        const { 
            comments, 
            commentText, 
            emptyComment, 
            user, 
            date, 
            numberComments } = this.state;
        const details = { username: user.username, date };
        // console.log('Date: ', this.state.date, typeof this.state.date);
        const alert = { type: 'warning', message: "Comment can't be empty"};
        return ( 
            <div className="card post">
                <div className="card-header post-header">
                    <ContentDetails 
                    details={details}
                    profilePicUrl={url}
                    onDelete={onDelete}
                    onLike={this.handleLike}
                    likes={likes}
                    numberComments={numberComments}
                    onClick={onPostClick}
                    showCommentIcon={true}/> 
                </div>
                <div className="card-body post-body">
                    { text &&  <p>{text}</p> }
                    {
                        media && 
                        <Media 
                        type={media.type}
                        src={media.src}
                        {...media.attr}/> 
                    }
                </div>

                <div className="card-footer post-footer">
                    {
                        showComments && 
                        <React.Fragment>      
                            <CreateCommentBox 
                            text={commentText}
                            onTextChange={this.handleCommentTextChange}
                            alert={emptyComment && alert}/>

                            <Comments 
                            comments={comments}
                            onDelete={this.handleDeleteComment}/>
                        </React.Fragment>
                        
                    }
                </div>
            </div>
         );
    }
}
 
export default Post;