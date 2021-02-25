import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// const httpLink =  createHttpLink({
//   credentials: 'include',
//   uri: 'http://localhost:3001/graphql',
// });

// const authLink = setContext((operation: GraphQLRequest, prevContext) => {
//   const context = operation.context;
//   const headers = context?.response.headers
//   console.log({ context, headers })
//   console.log({ prevContext })
//   console.log({ operation })
// })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  credentials: 'include',
  uri: 'http://localhost:3001/graphql',
  // link: authLink.concat(httpLink)
  // link: httpLink
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
