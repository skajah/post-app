import Icon from './icon';

class Like extends Icon {
    state = { 
        liked: false,
        classes: "fa fa-heart-o"
     }

    handleLike = () => {
        let { liked, classes } = this.state;
        liked = !liked;
        classes = liked ? "fa fa-heart" : "fa fa-heart-o";
        this.setState({ liked, classes });
        this.props.onClick(liked);
    }

    renderIcon() {
        // fa-layers fa-fw ?
        return (
        <button className="btn" onClick={this.handleLike}>
            <i className={this.state.classes} />
            <span className="fa-layers-counter"> {this.props.likes || null} </span>
        </button>
        );

    }

}
 
export default Like;