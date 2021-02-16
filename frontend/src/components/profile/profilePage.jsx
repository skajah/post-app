import React, { Component } from 'react';
import ProfileDetails from './profileDetails';
import TabNav from '../common/tabNav';

class ProfilePage extends Component {

    state = {
        currentTab: 'My Posts'
    }

    tabs = ['My Posts', 'Following', 'Followers']


    handleTabChange = tab => {
        this.setState({ currentTab: tab })

    }

    render() { 
        return ( 
            <div className="profile-page">
                <div className="card center">
                    <div className="card-header"> <ProfileDetails /> </div>
                    <div className="card-body">
                        <TabNav 
                        tabs={this.tabs}
                        currentTab={this.state.currentTab}
                        onClick={this.handleTabChange}/>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default ProfilePage;