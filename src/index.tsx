import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/react-hooks';
// import { createHttpLink } from 'apollo-link-http';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const link =  createHttpLink({
  credentials: 'same-origin',
  uri: "http://localhost:3001/graphql"
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Main />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
