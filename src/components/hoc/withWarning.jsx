import React from 'react';

function withWarning(Component) {
    return class WithWarning extends React.Component {

        render() {  
            const { warning, ...rest } = this.props;
            return (
            <div>
                <Component {...rest}/>
                { warning ? <div className="alert alert-warning">{warning}</div> : null }
            </div>);
        }
    }
} 

export default withWarning;