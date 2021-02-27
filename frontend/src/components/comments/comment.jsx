import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ContentDetails from '../common/contentDetails';
import { likeComment } from '../../services/commentService';
import UserContext from '../../context/userContext';


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

    populateState() {
        const { _id, user, date, text, likes } = this.props.comment;
        this.setState({ _id, user, date, text, likes: likes || 0});
    }

    handleLike = async (liked) => {
        try {
            const { data: comment } = await likeComment(this.state._id, liked);
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
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";
        const { onDelete } = this.props;
        const { _id, likes, text, user, date } = this.state;
        const details = {
            username: user.username,
            date
        };
        return ( 
            <div className="comment"> 
                <ContentDetails 
                details={details} 
                profilePicUrl={url}
                onDelete={onDelete}
                initialLike={this.context.currentUser.likedComments[_id]}
                onLike={this.handleLike}
                likes={likes}/>
                <p className="comment-text">{text}</p>
            </div>
         );
    }
}
 
export default Comment;