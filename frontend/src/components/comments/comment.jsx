import React from 'react';
import { toast } from 'react-toastify';
import { likeComment, unlikeComment } from '../../services/commentService';
import UserContext from '../../context/UserContext';
import ContentDetails from '../common/ContentDetails';
import Card from '../common/Card';
import Dropdown from '../common/Dropdown';
import IconCount from '../common/icons/IconCount';
import Like from '../common/icons/Like';

class Comment extends Card {
    static contextType = UserContext;

    state = {
        date: new Date(),
        text: '',
        user: {}
    }

    componentDidMount() {
        this.populateState();
    }

    populateState() {
        const { _id, user, date, text, likes } = this.props.comment;
        this.setState({ _id, user, date, text, likes });
    }

    handleLike = async (liked) => {
        try {
            const id = this.state._id;

            const { data: comment } = liked ? 
            await likeComment(id) :
            await unlikeComment(id);

            const { likes } = comment;
            this.context.onLike(comment._id, 'comment', liked);
            this.setState({ likes });
        } catch (ex) {
            if (ex.response){
                const status = ex.response.status;
                if (status === 400)
                    console.log(`Error liking comment: ${ex.response.data}`);
                else if (status === 404)
                    toast.error("Comment not found. Refresh to get latest content");
            }
        }
    }

    handleOptionSelected = option => {
        const { onProfileClick, onDelete, onFollow } = this.props;
        const { user, _id } = this.state;

        if (option === 'Profile')
            onProfileClick(user._id);
        else if (option === 'Follow' || option === 'Unfollow')
            onFollow(user._id);
        else if (option === 'Delete')
            onDelete(_id);
    }

    render() { 
        const { _id, text, user, likes, date } = this.state;
        const { onProfileClick } = this.props;
        const { currentUser } = this.context;
        const initialLike = currentUser.likedComments[_id];
        const following = currentUser.following[user._id];
        const options = ['Profile', following ? 'Unfollow' : 'Follow'];
        if ( currentUser._id === user._id)
            options.push('Delete');

        return (
        <div className="card comment">
            <header className="card__header post__header">
                <ContentDetails 
                profilePicSrc={user.profilePic}
                onProfileClick={() => onProfileClick(user._id)} 
                username={user.username} 
                date={date}/>
                <Dropdown options={options} onOptionSelected={this.handleOptionSelected}/>
            </header>
            <div className="card__body comment__body">
                { text }
                <div className="comment__details">
                    <IconCount count={likes}>
                      <Like onLike={this.handleLike} initialLike={initialLike}/>
                    </IconCount>
                </div>
            </div>
        </div>
        );
    }
}
 
export default Comment;