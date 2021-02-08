import React  from 'react'
import { Route, Redirect } from 'react-router-dom';
import auth from '../../services/authService';

const ProtectedRoute = (props) => {
    const { component: Component, render, ...rest } = props;
    const user = auth.getCurrentUser();
    return ( 
        <Route // protected route
              {...rest}
              render={(props) => {
                if (!user) return <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />;
                return Component ? <Component {...props} /> : render(props);
              }}
            />
     );
}
 
export default ProtectedRoute;