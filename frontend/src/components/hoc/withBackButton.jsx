import React from 'react';
import Arrow from '../common/icons/arrow';

function withBackButton(Component) {
    return class withBackButton extends React.Component {

        render() {  
            return (
            <div className="with-back-button">
                <div>
                    <Arrow direction="left" stem={true}/>
                </div>
                <Component {...this.props}/>
            </div>);
        }
    }
} 

export default withBackButton;