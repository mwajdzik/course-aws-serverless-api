import React, {useEffect, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {createGenerateClassName, StylesProvider} from '@material-ui/core/styles';
import {CognitoUserPool} from "amazon-cognito-identity-js";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Confirm from "./components/Confirm";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import compareYourselfApi from './api/compare-yourself-api';
import AddData from "./components/AddData";

const userPool = new CognitoUserPool({
    UserPoolId: 'us-west-2_Yedy3Sv7q',
    ClientId: '2gje8cfuvcllig1l85h0k1h4l5'
});

const generateClassName = createGenerateClassName({
    productionPrefix: 'au'
});

const retrieveItems = (setItems) => {
    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
        currentUser.getSession(async (err, session) => {
            if (err) {
                setItems([]);
            }

            const result = await compareYourselfApi.get('/dev/compare-yourself/all?accessToken=' + session.getAccessToken().getJwtToken(), {
                headers: {'Authorization': session.getIdToken().getJwtToken()}
            });

            console.log(result.data);
            setItems(result.data);
        });
    } else {
        setItems([]);
    }
}

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [dashboardItems, setDashboardItems] = useState([]);

    useEffect(() => {
        console.log("signed in: " + isSignedIn);

        if (isSignedIn) {
            retrieveItems((items) =>
                setDashboardItems(items));
        }
    }, [isSignedIn]);

    return <div>
        <StylesProvider generateClassName={generateClassName}>
            <BrowserRouter>
                <Header isSignedIn={isSignedIn}
                        onSignOut={() => {
                            setIsSignedIn(false);
                            setDashboardItems([]);
                            userPool.getCurrentUser().signOut();
                        }}/>
                <Switch>
                    <Route path="/auth/signin">
                        <Signin userPool={userPool} callback={() => {
                            setIsSignedIn(true)
                        }}/>
                    </Route>
                    <Route path="/auth/confirm">
                        <Confirm userPool={userPool}/>
                    </Route>
                    <Route path="/auth/signup">
                        <Signup userPool={userPool}/>
                    </Route>
                    <Route path="/">
                        {!isSignedIn && <Redirect to="/auth/signin"/>}
                        <Dashboard items={dashboardItems} userPool={userPool} callback={() => {
                            retrieveItems((items) =>
                                setDashboardItems(items));
                        }}/>
                        <AddData userPool={userPool} callback={() => {
                            retrieveItems((items) =>
                                setDashboardItems(items));
                        }}/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </StylesProvider>
    </div>
};

export default App;
