import React, { Component } from 'react';
import Comment from './icons/comment';
import Delete from './icons/delete';
import Like from './icons/like';
import UserContext from '../../context/userContext';
import ProfilePic from './profilePic';
import { updateMe } from '../../services/userService';
import Dropdown from './dropdown';

class ContentDetails extends Component {
    static contextType = UserContext

    handleFollow = async (id) => {
        const isFollowing = this.context.currentUser.following[id] ? true : false;
        await updateMe({ following: { id, follow: !isFollowing } })
        this.context.onFollow(id)
    }

    handleOptionSelected = option => {
        const { userId } = this.props.details;
        switch (option) {
            case 'Follow':
            case 'Unfollow':
                this.handleFollow(userId);
                break;
            case 'Profile':
                this.props.onProfile(userId);
                break;
            case 'Delete':
                this.props.onDelete();
                break;
            default:
                break;
        }
    }
    render() { 
        const { 
            details, 
            profilePic,
            onLike, 
            likes, 
            onClick, 
            onDelete,
            numberOfComments,
            showCommentIcon,
            initialLike,
            hideOptionMenu,
            headerIconSpan } = this.props;
        // console.log(profilePicUrl, comment);
        const { currentUser } = this.context;
        const { username, date, userId } = details;
        const following = currentUser.following[userId] || false;
        const options = [following ? 'Unfollow' : 'Follow', 'Profile'];
        const sameUser = userId === currentUser._id;
        if (sameUser)
            options.push('Delete');
        return ( 
            <div className="row content-details">
                <div 
                className={`col-${12-(headerIconSpan || 4)}` + (onClick ? ' clickable' : '')}
                onClick={onClick}>

                    <ProfilePic src={profilePic} />
                    <div className="date-time">   
                        <span className="username">{username}</span>    
                        <span className="time">{date.toLocaleTimeString()}</span>
                        <br/>
                        <span className="date">{date.toDateString()}</span>
                    </div>
                </div>
                <div className={`col-${headerIconSpan || 4} post-icons`}>
                    { 
                    showCommentIcon &&
                    <Comment numberOfComments={numberOfComments} onClick={onClick}/> 
                    }
                    <Like onClick={onLike} likes={likes} initialLike={initialLike}/>
                    {
                        hideOptionMenu ? 
                        (
                            sameUser ? <Delete onClick={onDelete} /> : null
                        ) :
                        <Dropdown options={options} onOptionSelected={this.handleOptionSelected}/>
                    }
                    
                </div>
            </div>
         );
    }
}
 
export default ContentDetails;