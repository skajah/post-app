import React from 'react'
import Icon from './icon';

class Delete extends Icon {
    // clickable in state
    classes = "fa fa-trash-o delete-icon " + this.clickable;

    renderIcon = () => {
        const { classes, onDelete } = this.props;
        return <i 
        className={classes || this.classes}
        onClick={onDelete}/>;
    }

    render() { 
        return this.renderIcon();
    }
}
 
export default Delete;