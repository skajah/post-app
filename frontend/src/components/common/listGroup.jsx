import React, { Component } from 'react'

class ListGroup extends Component {
    render() { 
        const { items, selectedItem, onClick } = this.props;
        return ( 
            <ul className="list-group">
                {
                    items.map(item => {
                        return <li 
                        className={"list-group-item" + (item === selectedItem ? ' active' : '')}
                        onClick={() => onClick(item)}>{item}</li>;
                    })
                }
            </ul>
         );
    }
}
 
export default ListGroup;