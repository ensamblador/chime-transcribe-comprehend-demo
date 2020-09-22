import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports';

// Containers or Views
import ViewerApp from './viewer/App'
import MeetingApp from './meeting/App'


const client = new AWSAppSyncClient({
    url: awsconfig.aws_appsync_graphqlEndpoint,
    region: awsconfig.aws_appsync_region,
    auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: awsconfig.aws_appsync_apiKey,
    }
  })

const ROUTES = [
    {
        path: '/',
        component: MeetingApp
    },
    {
        path: '/viewer',
        component: ViewerApp
    }
]

const RouterComponent = () => (
    <BrowserRouter>
        <Switch>
            {
                ROUTES.map(({ component: CustomComponent, path }) => {
                    return <Route 
                        exact
                        key={path}
                        path={path}
                        render={props => <CustomComponent {...props} client={client} />}
                    />
                })
            }
        </Switch>
    </BrowserRouter>
)

export default RouterComponent