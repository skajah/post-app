import React, { Component } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { likeComment, unlikeComment } from '../../services/commentService';
import UserContext from '../../context/userContext';
import './Comment.css';
import ContentDetailsHeader from '../common/ContentDetailsHeader';

class Comment extends Component {
    static contextType = UserContext;

    state = {
        date: new Date(),
        text: '',
        user: {}
    }

    componentDidMount() {
        this.populateState();
    }

    async populateState() {
        const { _id, user, date, text, likes } = this.props.comment;
        this.setState({ _id, user, date, text, likes: likes || 0});
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

    render() { 
        const { onDelete, onProfile } = this.props;
        const { _id, likes, text, user, date } = this.state;
        const details = {
            username: user.username,
            date,
            userId: user._id,
            profilePic: user.profilePic
        };
        if (_.isEmpty(user)) return null; 
        return ( 
            <div className="comment"> 
                <ContentDetailsHeader
                details={details} 
                onDelete={onDelete}
                onProfile={onProfile}
                initialLike={this.context.currentUser.likedComments[_id]}
                onLike={this.handleLike}
                likes={likes}/>
                <p className="comment-text">{text}</p>
            </div>
         );
    }
}
 
export default Comment;