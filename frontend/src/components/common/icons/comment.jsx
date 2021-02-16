import Icon from './icon';

class Comment extends Icon {
    state = {
        classes: "fa fa-comment-o"
    }

    render(){
        const { onClick, numberComments } = this.props;
        return (
            <button className="btn" onClick={onClick}>
                <i className={this.getClasses()} />
                <span className="fa-layers-counter comment-counter"> {numberComments || null} </span>
            </button>
            );
    }
}
 
export default Comment;