import React from 'react';
import { Meeting } from './Meeting'

//import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
//import awsconfig from '../aws-exports';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

/* const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsconfig.aws_appsync_apiKey,
  }
}) */


const App = ({ client }) => (
  <Meeting client={client} />
)



export default App
