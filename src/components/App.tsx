import React from 'react';
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Users from './Users';

function Main() {
  return (
    <Router>
      <Switch>
        <Route path='/login'>
          <SignIn />
        </Route>
        <Route path='/register'>
          <SignUp />
        </Route>
        <Route path='/users'>
          <Users />
        </Route>
      </Switch>
    </Router>
  );
}

export default Main;
