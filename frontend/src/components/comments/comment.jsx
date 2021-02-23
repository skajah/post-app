import React, { Component } from 'react'
import ContentDetails from '../common/contentDetails';
import { getLikes } from '../../utils/getLikes';


class Comment extends Component {
    state = {
        date: new Date(),
        text: '',
        user: {}
    }

    componentDidMount() {
        this.populateState();
    }

    populateState() {
        const { user, date, text, likes } = this.props.comment;
        this.setState({ user, date, text, likes: likes || 0});
    }

    handleLike = (liked) => {
        const likes = getLikes(this.state.likes, liked);
        this.setState({ likes });
    }

    render() { 
        const url = "https://i.pinimg.com/736x/65/8f/56/658f56ab9e1c31865e8bf86fe88ad2ae.jpg";
        const { onDelete } = this.props;
        const { likes, text, user, date } = this.state;
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
                onLike={this.handleLike}
                likes={likes}/>
                <p className="comment-text">{text}</p>
            </div>
         );
    }
}
 
export default Comment;