import React, {useEffect, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {createGenerateClassName, StylesProvider} from '@material-ui/core/styles';
import {CognitoUserPool} from "amazon-cognito-identity-js";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Confirm from "./components/Confirm";
import Header from "./components/Header";
import AddData from "./components/AddData";
import Dashboard from "./components/Dashboard";

const userPool = new CognitoUserPool({
    UserPoolId: 'us-west-2_Yedy3Sv7q',
    ClientId: '2gje8cfuvcllig1l85h0k1h4l5'
});

const generateClassName = createGenerateClassName({
    productionPrefix: 'au'
});

const getAuthenticatedUser = () => {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                alert("!!! " + (err.message || JSON.stringify(err)));
                return;
            }

            cognitoUser.getUserAttributes(function (err, attributes) {
                if (err) {
                    // Handle error
                    alert("!!! " + (err.message || JSON.stringify(err)));
                    return;
                }

                console.log(attributes);
            });
        });
    }
}

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        console.log("useEffect " + isSignedIn);

        if (isSignedIn) {
            //history.push('/dashboard');
        }
    }, [isSignedIn]);

    return <div>
        <StylesProvider generateClassName={generateClassName}>
            <BrowserRouter>
                <Header isSignedIn={isSignedIn}
                        onSignOut={() => {
                            setIsSignedIn(false);
                            userPool.getCurrentUser().signOut();
                        }}/>
                <Switch>
                    <Route path="/dashboard">
                        {!isSignedIn && <Redirect to="/"/>}
                        <Dashboard userPool={userPool}/>
                    </Route>
                    <Route path="/add">
                        {!isSignedIn && <Redirect to="/"/>}
                        <AddData userPool={userPool}/>
                    </Route>
                    <Route path="/auth/signin">
                        <Signin userPool={userPool} callback={() => setIsSignedIn(true)}/>
                    </Route>
                    <Route path="/auth/confirm">
                        <Confirm userPool={userPool}/>
                    </Route>
                    <Route path="/auth/signup">
                        <Signup userPool={userPool}/>
                    </Route>
                    <Route path="/">
                    </Route>
                </Switch>
            </BrowserRouter>
        </StylesProvider>
    </div>
};

export default App;
