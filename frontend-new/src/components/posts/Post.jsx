import React from 'react'
import { toast } from 'react-toastify';
import Card from '../common/Card';
import Comment from '../comments/Comment';
import ContentDetails from '../common/ContentDetails';
import IconCount from '../common/icons/IconCount';
import Dropdown from '../common/Dropdown';
import Media from '../common/Media';
import Like from '../common/icons/Like';
import { GoComment } from 'react-icons/go';
import { makeDate } from '../../utils/makeDate';
import { createComment, deleteComment } from '../../services/commentService';
import { likePost, unlikePost } from '../../services/postService';
import CreateCommentBox from '../comments/CreateCommentBox';
import UserContext from '../../context/UserContext';
import { updateMe } from '../../services/userService';

class Post extends Card {

    static contextType = UserContext;

    state = { 
        user: {},
        date: new Date(),
        comments: []
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
            likes: likes,
        });
    }

    handleDeleteComment = async ({ _id }) => {
        try {
            await deleteComment(_id);
            const comments = this.state.comments.filter(c => c._id !== _id);
            this.setState({ comments, numberOfComments: comments.length });
        } catch (ex){
            if (ex.response){
                const status = ex.response.status;
                if (status === 401)
                    toast.warning("Can only delete your own posts/comments");
                else if (status === 404)
                    toast.error("Comment not fond. Refresh to get latest content");
            }        
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
            toast.error('Some went wrong when commenting');
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

    handleFollow = async (id) => {
        const isFollowing = this.context.currentUser.following[id] ? true : false;
        await updateMe({ following: { id, follow: !isFollowing } })
        this.context.onFollow(id)
    }

    handleOptionSelected = option => {
        const { onProfileClick, onDelete } = this.props;
   
        const { user, _id } = this.state;

        if (option === 'Profile')
            onProfileClick(user._id);
        else if (option === 'Follow' || option === 'Unfollow')
            this.handleFollow(user._id)
        else if (option === 'Delete')
            onDelete(_id);
    }

    render() {
        const { 
            _id,
            text, 
            media, 
            user, 
            date,
            numberOfComments,
            comments,
            likes,
            emptyComment } = this.state;
        const { 
            showComments,
            onPostClick,
            onProfileClick
            } = this.props;

        const { currentUser } = this.context;
        const initialLike = currentUser.likedPosts[_id];
        const following = currentUser.following[user._id];
        const options = ['Profile', following ? 'Unfollow' : 'Follow'];
        if ( currentUser._id === user._id)
            options.push('Delete');

        const alert = { type: 'secondary', message: "Comment can't be empty" };

        return (
            <React.Fragment>
              <div className="card post">
                <header className="card__header post__header">
                  <ContentDetails 
                  profilePicSrc={user.profilePic}
                  onProfileClick={() => onProfileClick(user._id)} 
                  username={user.username} 
                  date={date}/>
                  <Dropdown options={options} onOptionSelected={this.handleOptionSelected}/>
                </header>
                <div className="card__body post__body">
                  { text &&  <p>{text}</p> }
                  {
                    media && 
                    <Media 
                    type={media.mediaType}
                    src={media.data}
                    className="media"/> 
                  }
                  <div className="post__details">
                    <IconCount 
                    count={likes} 
                    margins={true}>
                      <Like initialLike={initialLike} onLike={this.handleLike}/>
                    </IconCount>

                    <IconCount 
                    count={numberOfComments} 
                    onClick={onPostClick && (() => onPostClick(_id)) }>
                      <GoComment />
                    </IconCount>
                  </div>
                </div>
              </div>
              {
                showComments &&
                <div className="comments">
                    <CreateCommentBox 
                    onCreate={this.handleCreateComment}
                    alert={ emptyComment && alert}/>
                    {
                        comments.map(comment => {
                            return <Comment 
                                    comment={comment} 
                                    key={comment._id}
                                    onDelete={() => this.handleDeleteComment(comment)}
                                    onProfileClick={onProfileClick}
                                    onFollow={this.handleFollow}
                                    />
                        })
                    }
                </div>
              }         
            </React.Fragment>
        );
    }
}


export default Post;