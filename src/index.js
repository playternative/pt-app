import React from 'react';
import ReactDOM from 'react-dom';
import { InMemoryCache, ApolloClient } from '@apollo/client';
import { ApolloProvider } from 'react-apollo'
import './index.css';
import App from './App';

import { createUploadLink } from 'apollo-upload-client';


const client = new ApolloClient({
  link: createUploadLink({
    uri: 'http://localhost:2500/graphql'
  }),
  uri: `http://localhost:2500/graphql`,
  onError: ({ networkError, graphQLErrors }) => {
    console.log("graphQLErrors", graphQLErrors);
    console.log("networkErrors", networkError);
  },
  cache: new InMemoryCache()
});

const render = (Component) => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Component />
    </ApolloProvider>,
    document.getElementById("app"));
};

export default render(App)
