import Icon from './icon';

class Comment extends Icon {
    state = {
        classes: "fa fa-comment-o"
    }

    renderIcon(){
        const { onClick, numberOfComments, disabled } = this.props;
        return (
            <span className={ !disabled && "clickable"} onClick={ !disabled && onClick}>
                <i className={this.getClasses()} />
                <span className="fa-layers-counter comment-counter"> {numberOfComments || null} </span>
            </span>
            );
    }
}
 
export default Comment;