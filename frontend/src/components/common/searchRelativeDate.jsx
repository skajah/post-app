import React, { Component } from 'react'
import ListGroup from './listGroup';

class SearchRelativeDate extends Component {

    render() { 
        const { dates, selectedDate, onDateSelected} = this.props;

        return <ListGroup 
        items={dates} 
        selectedItem={selectedDate}
        onClick={onDateSelected}/>;
    }
}
 
export default SearchRelativeDate;