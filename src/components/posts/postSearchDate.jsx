import React, { Component } from 'react'
import ListGroup from '../common/listGroup';

class PostSearchDate extends Component {

    render() { 
        const { dates, selectedDate, onDateSelected} = this.props;

        return <ListGroup 
        items={dates} 
        selectedItem={selectedDate}
        onClick={onDateSelected}/>;
    }
}
 
export default PostSearchDate;