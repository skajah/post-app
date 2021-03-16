import React, { Component } from 'react'
import { toast } from 'react-toastify';
import Comments from '../comments/comments';
import CreateCommentBox from '../comments/createCommentBox';
import ContentDetails from '../common/contentDetails';
import _ from 'lodash';
import Media from '../common/media';
import { makeDate } from '../../utils/makeDate';
import { likePost, unlikePost } from '../../services/postService';
import { createComment, deleteComment } from '../../services/commentService';
import UserContext from '../../context/userContext';
import { decompress } from '../../utils/media';
import profilePic from '../../images/profile_default.jpg';

class Post extends Component {
    static contextType = UserContext;

    state = { 
        user: {},
        date: new Date(),
        text: '',
        media: null,
        comments: [],
        likes: 0, // could leaveOut
        emptyComment: false,
    } 
    componentDidMount() {
        this.populateState();
    }

    populateState(){
        const { _id, user, date, text, media, comments, numberOfComments, likes } = this.props.post;
        if (media)
            media.data = decompress(media.data);
        // user.profilePic = decompress(user.profilePic);
        if (user.profilePic)
            user.profilePic = decompress(user.profilePic);
        else 
            user.profilePic = profilePic;

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
            const postId = this.state._id;
            const newComment = {
                postId,
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
            const id = this.state._id;

            const { data: post } = liked ? 
            await likePost(id):
            await unlikePost(id);

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

    render() { 
        const { 
            _id,
            text, 
            media, 
            likes,
            comments, 
            emptyComment, 
            user, 
            date,
            numberOfComments } = this.state;
        const { onDelete, showComments, onPostClick } = this.props;        
        const details = { username: user.username, date };
        // console.log('Date: ', this.state.date, typeof this.state.date);
        const alert = { type: 'warning', message: "Comment can't be empty"};
        // console.log('Liked post: ', this.context.currentUser.likedPosts)
        // console.log('id: ', _id);
        // console.log('Found: ', this.context.currentUser.likedPosts[_id]);
        if (_.isEmpty(user)) return null;
        return ( 
            <div className="card post">
                <div className="card-header post-header">
                    <ContentDetails 
                    details={details}
                    onDelete={onDelete}
                    profilePic={user.profilePic}
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
                        type={media.mediaType}
                        src={media.data}
                        className="post-media"/> 
                    }
                </div>

                <div className="card-footer post-footer">
                    {
                        showComments && 
                        <React.Fragment>      
                            <CreateCommentBox 
                            alert={emptyComment && alert}
                            onCreate={this.handleCreateComment}/>

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