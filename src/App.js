import React, { Component } from 'react';
// import logo from './logo.svg';
import { Redirect, Route, Link, withRouter} from 'react-router-dom';
import './App.css';

const Public = () => (
  <div> This is a public page </div>
);

const Private = () => (
  <div> This is a private page </div>
);

// Login Component to be able to have a login function and also
//  redirect back to the route that the user was trying to log onto
  // when the user was denied access. This should be typical behavior of your routing system else users will always be redirected to a particular page rather than where they came from!

class Login extends React.Component {
  state = {
    redirectToPreviousRoute: false
  };

  login = () => {
    AuthService.authenticate(() => {
      this.setState({ redirectToPreviousRoute: true });
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToPreviousRoute } = this.state;

    if (redirectToPreviousRoute) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}

// Auth Service will simply be an object 
const AuthService = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  logout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const SecretRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthService.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
  )} />
);


// provide a logout button for the user after successful authentication?
// withRouter is a higher order component from React Router that allows re-rendering of its 
// component every time the route changes with the same props. 
// history.push is one way of redirecting asides using the <Redirect /> component from React Router.
const AuthStatus = withRouter(({ history }) => (
  AuthService.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        AuthService.logout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
));


class App extends Component {
  render() {
    return (
      <div>
        <div style={{width: 1000, margin: '0 auto'}}>
        <AuthStatus />
          <ul>
            <li><Link to='/public'> Public </Link></li>
            <li><Link to='/private'> Private </Link></li>
          </ul>

          <hr/>

          <Route path='/public' component={Public} />
          <SecretRoute path='/private' component={Private} />
        </div>
      </div>
    );
  }
}

export default App;
