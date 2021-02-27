import React, { Component } from 'react'
import { toast } from 'react-toastify';
import Comments from '../comments/comments';
import CreateCommentBox from '../comments/createCommentBox';
import ContentDetails from '../common/contentDetails';
import _ from 'lodash';
import Media from '../common/media';
import { makeDate } from '../../utils/makeDate';
import { likePost } from '../../services/postService';
import { createComment, deleteComment } from '../../services/commentService';
import UserContext from '../../context/userContext';

class Post extends Component {
    static contextType = UserContext;

    state = { 
        user: {},
        date: new Date(),
        text: '',
        media: null,
        comments: [],
        likes: 0,
        commentText: '',
        emptyComment: false,
    } 
    componentDidMount() {
        this.populateState();
    }

    populateState(){
        const { _id, user, date, text, media, comments, numberOfComments, likes } = this.props.post;
        this.setState({ 
            _id,
            user, 
            date: date || new Date(), 
            text, 
            media, 
            comments: comments || [],
            numberOfComments,
            likes: likes || 0,
        });
    }

    handleDeleteComment = async ({ _id }) => {
        const originalComments = this.state.comments;
        const comments  = originalComments.filter(c => c._id !== _id );
        
        this.setState({ comments });
        try {
            await deleteComment(_id);
        } catch (ex){
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warning("Can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Comment not fond. Refresh to get latest content");
            }
            this.setState({ comments: originalComments });
        }
    }

    handleCreateComment = async (text) => {
        if (!text.trim()){
            this.setState({ emptyComment: true });
            return;
        }

        try {
            const newComment = {
                postId: this.state._id,
                userId: this.context.currentUser._id,
                text
            };
            const { data: comment } = await createComment(newComment);
            makeDate(comment);
            const comments = [...this.state.comments];
            comments.unshift(comment);
            this.setState({ 
                comments, 
                emptyComment: false 
            });
        } catch (ex) {
            // REVISIT
            
        }
    }

    handleLike = async (liked) => {
        try {
            const { data: post } = await likePost(this.state._id, liked);
            const { likes } = post;
            this.context.onLike(post._id, 'post', liked);
            this.setState({ likes });
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 400)
                    console.log(`Error liking post: ${ex.response.data}`);
                else if (status === 404)
                    toast.error("Post not found. Refresh to get latest content");
            }
        }
    
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
        const { 
            _id,
            text, 
            media, 
            likes,
            comments, 
            commentText, 
            emptyComment, 
            user, 
            date,
            numberOfComments } = this.state;
        const { onDelete, showComments, onPostClick } = this.props;
        const url = "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80";
        
        const details = { username: user.username, date };
        // console.log('Date: ', this.state.date, typeof this.state.date);
        const alert = { type: 'warning', message: "Comment can't be empty"};
        // console.log('Liked post: ', this.context.currentUser.likedPosts)
        // console.log('id: ', _id);
        // console.log('Found: ', this.context.currentUser.likedPosts[_id]);
        return ( 
            <div className="card post">
                <div className="card-header post-header">
                    <ContentDetails 
                    details={details}
                    profilePicUrl={url}
                    onDelete={onDelete}
                    initialLike={this.context.currentUser.likedPosts[_id]}
                    onLike={this.handleLike}
                    likes={likes}
                    numberOfComments={numberOfComments || comments.length}
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