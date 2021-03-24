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
        if (!this.state.initialLike && this.props.initialLike){
            this.setState({ liked: true, initialLike: true, classes: "fa fa-heart" });

        }
        return (
        <span className="clickable" onClick={this.handleLike}>
            <i className={this.getClasses()} />
            <span className="fa-layers-counter like-counter"> {this.props.likes || null} </span>
        </span>
        );

    }

}
 
export default Like;