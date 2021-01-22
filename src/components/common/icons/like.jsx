import Icon from './icon';

class Like extends Icon {
    state = { 
        liked: false
     }

    getHeartStyle() {
        return this.state.liked ? '' : '-o';
    }

    handleLike = () => {
        const liked = !this.state.liked;
        this.setState({ liked });
        this.props.onLike(liked);
    }

    renderIcon() {
        return (
        <span class="fa-layers fa-fw"
        onClick={this.handleLike}>
            <i class={"fa fa-heart" + this.getHeartStyle()} />
            <span class="fa-layers-counter"> {this.props.likes || null} </span>
        </span>);

    }

    render() { 
        return this.renderIcon();
    }
}
 
export default Like;