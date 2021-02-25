import React from 'react';
import {
  BrowserRouter as Router,

  Route, Switch
} from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';

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
      </Switch>
    </Router>
  );
}

export default Main;
