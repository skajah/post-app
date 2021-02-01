import React, { Component } from 'react'
import withAlert from '../hoc/withAlert';

class SearchDateRange extends Component {

    // Not in state because no need to rerender on these changes

    dateRange = { start: null, end: null }

    handleStartDate = e => {
        const dateString = e.target.value.replaceAll('-', '/');
        this.dateRange.start = new Date(dateString);
        this.handleDateChange();
    }
    
    handleEndDate = e => {
        const dateString = e.target.value.replaceAll('-', '/');
        this.dateRange.end = new Date(dateString);
        this.handleDateChange();
    }

    handleDateChange = () => {
        const { start, end } = this.dateRange;
        if (start && end)
            this.props.onDateRange(start, end);
    }

    render() { 
        return ( 
            <div className="search-date-range">
                <input type="date" name="start-date" onChange={this.handleStartDate}/>
                <span> to </span>
                <input type="date" name="end-date" onChange={this.handleEndDate}/>
            </div>
         );
    }
}
 
export default withAlert(SearchDateRange);