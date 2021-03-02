import React, { Component } from 'react'
import TextBox from './textBox';
import Search from './icons/search';

class SearchKeyword extends Component {

    text = ''
    handleSearchTextChange = text => {
        this.text = text;
    }

    handleKeywordSearch = () => {
        this.props.onKeywordSearch(this.text);
    }
    
    render() { 
        const { placeHolder } = this.props;

        return ( 
            <div className="search-keyword">
                <TextBox 
                name="searchKeyword" 
                placeHolder={placeHolder} 
                className="text-box search-keyword-text-box"
                type="input"
                onTextChange={this.handleSearchTextChange}
                />
                <Search size="lg" onClick={this.handleKeywordSearch}/> 
            </div>
         );
    }
}
 
export default SearchKeyword;