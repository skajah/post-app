import React, { Component } from 'react'

class TabNav extends Component {

    render() { 
        const { tabs, currentTab, onClick } = this.props;

        return ( 
            <div className="tab-nav">
                {
                    tabs.map(tab => {
                        return <p 
                        key={tab}
                        className={"tab-nav-item" + (tab === currentTab ? " tab-nav-active" : '')}
                        onClick={() => onClick(tab)}>{tab}</p>
                    })
                }
            </div>
         );
    }
}
 
export default TabNav;