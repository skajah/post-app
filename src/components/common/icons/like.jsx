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
        return (
        <span className="fa-layers fa-fw"
        onClick={this.handleLike}>
            <i className={this.getClasses()} />
            <span className="fa-layers-counter"> {this.props.likes || null} </span>
        </span>);

    }

}
 
export default Like;