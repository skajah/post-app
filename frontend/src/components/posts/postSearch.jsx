import React, { Component } from 'react'
import SearchKeyword from '../common/searchKeyword';
import SearchRelativeDate from '../common/searchRelativeDate';
import SearchDateRange from '../common/searchDateRange';

class PostSearch extends Component {

    state = {
        dateRangeError: false
    }

    handleDateRange = (start, end) => {
        if (start > end)
            this.setState({ dateRangeError: true });
        else{
            this.props.onDateRange(start, end);
            this.setState({ dateRangeError: false });
        }
    }

    render() { 
        const { 
            searchByKeyword, 
            dates, 
            selectedDate, 
            onDateSelected } = this.props;

        const { dateRangeError } = this.state;
        const alert = { type: 'danger', message: "Start date can't be after end date "};

        return ( 
            <div className="post-search">
                <p
                style={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                }}
                >Search for posts</p>
                <SearchKeyword 
                placeHolder=" Enter a username"
                onKeywordSearch={searchByKeyword}/>

                <p
                style={{margin: '1.5rem 0 .5rem', fontWeight: '500'}}
                >Select a date</p>

                <SearchRelativeDate 
                dates={dates} 
                selectedDate={selectedDate}
                onDateSelected={onDateSelected}/>

                <SearchDateRange 
                onDateRange={this.handleDateRange}
                alert={dateRangeError && alert}/>
            </div>
         );
    }
}
 
export default PostSearch;