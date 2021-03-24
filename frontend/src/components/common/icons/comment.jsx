import Icon from './icon';

class Comment extends Icon {
    state = {
        classes: "fa fa-comment-o"
    }

    render(){
        const { onClick, numberOfComments } = this.props;
        return (
            <span className="clickable" onClick={onClick}>
                <i className={this.getClasses()} />
                <span className="fa-layers-counter comment-counter"> {numberOfComments || null} </span>
            </span>
            );
    }
}
 
export default Comment;