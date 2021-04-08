import React, { Component } from 'react'
import { toast } from 'react-toastify';
import Comments from '../comments/comments';
import CreateCommentBox from '../comments/CreateCommentBox';
import _ from 'lodash';
import Media from '../common/media';
import { makeDate } from '../../utils/makeDate';
import { likePost, unlikePost } from '../../services/postService';
import { createComment, deleteComment } from '../../services/commentService';
import UserContext from '../../context/userContext';
import './Post.css';
import ContentDetailsHeader from '../common/ContentDetailsHeader';
import ContentDetailsFooter from '../common/ContentDetailsFooter';

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

    async populateState(){
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
        
        this.setState({ comments, numberOfComments: comments.length });
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
            this.setState({ comments: originalComments, numberOfComments: originalComments.length });
        }
    }

    handleCreateComment = async (text) => {
        if (!text.trim()){
            this.setState({ emptyComment: true });
            return;
        }

        try {
            const postId = this.state._id;
            const { currentUser } = this.context;
            const newComment = {
                postId,
                userId: currentUser._id,
                text
            };
            const { data: comment } = await createComment(newComment);
            makeDate(comment);
            comment.user.profilePic = currentUser.profilePic;
            const comments = [...this.state.comments];
            comments.unshift(comment);
            this.setState({ 
                comments, 
                emptyComment: false,
                numberOfComments: comments.length
            });
        } catch (ex) {
            // REVIS IT
            
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
        const { showComments, onPostClick, onProfile, onDelete, hideOptionMenu, headerIconSpan } = this.props;        
        const details = { username: user.username, date, userId: user._id, profilePic: user.profilePic };
        const initialLike = this.context.currentUser.likedPosts[_id];
        const alert = { type: 'warning', message: "Comment can't be empty"};
        const sameUser = this.context.currentUser._id === user._id;
        // console.log('Liked post: ', this.context.currentUser.likedPosts)
        // console.log('id: ', _id);
        // console.log('Found: ', this.context.currentUser.likedPosts[_id]);
        if (_.isEmpty(user)) return null;

        return (
            <React.Fragment>
                <div className="card post">
                    <div className="card-header post-header">
                        <ContentDetailsHeader 
                        details={details}
                        onDelete={onDelete}
                        onProfile={onProfile}
                        onPostClick={onPostClick}
                        hideOptionMenu={hideOptionMenu}
                        />
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
                        <ContentDetailsFooter 
                        likes={likes}
                        numberOfComments={numberOfComments}
                        initialLike={initialLike}
                        onLike={this.handleLike}
                        onDelete={ sameUser && onDelete}/>
                    </div>
                </div>
                {
                    showComments &&
                    <React.Fragment>
                        <CreateCommentBox 
                        alert={emptyComment && alert}
                        onCreate={this.handleCreateComment}/>

                        <Comments 
                        comments={comments}
                        onDelete={this.handleDeleteComment}
                        onProfile={onProfile}/>
                    </React.Fragment>
                }
            </React.Fragment>
         );
    }
}
 
export default Post;