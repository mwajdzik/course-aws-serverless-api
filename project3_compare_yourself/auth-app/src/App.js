import React, {useEffect, useState} from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';
import {createBrowserHistory} from "history";
import {createGenerateClassName, StylesProvider} from '@material-ui/core/styles';
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool} from "amazon-cognito-identity-js";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Confirm from "./components/Confirm";
import Header from "./components/Header";
import AddData from "./components/AddData";
import Dashboard from "./components/Dashboard";

const history = createBrowserHistory();

const poolData = {
    UserPoolId: 'us-east-1_XRYUy2SJw',
    ClientId: '645lu077qun0t1jbtn2mgfdafs'
};

const userPool = new CognitoUserPool(poolData);

const generateClassName = createGenerateClassName({
    productionPrefix: 'au'
});

const onSignUp = (username, email, password) => {
    const dataEmail = {
        Name: 'email',
        Value: email
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);

    userPool.signUp(username, password, [attributeEmail], null, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }

        const cognitoUser = result.user;
        console.log('username is ' + cognitoUser.getUsername());
        history.push("/auth/confirm")
    });
}

const onConfirm = (username, code) => {
    const userData = {
        Username: username,
        Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }

        console.log('result is ' + result);
        history.push("/auth/signin")
    });
}

const onSignIn = (username, password, callback) => {
    console.log(username, password);

    const authenticationData = {Username: username, Password: password};
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {Username: username, Pool: userPool};
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const accessToken = result.getAccessToken().getJwtToken();
            console.log('Access Token: ' + accessToken);
            history.push("/dashboard");

            callback();
        },

        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },
    });
}

const getAuthenticatedUser = () => {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                // todo: not logged in
                return;
            }
            console.log('session validity: ' + session.isValid());

            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes(function (err, attributes) {
                if (err) {
                    // Handle error
                    console.log(err);
                } else {
                    // Do something with attributes
                    console.log(attributes);
                }
            });
        });
    } else {
        return <div>Not logged in!</div>
    }

    return <div>OK</div>
}

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            history.push('/dashboard');
        }
    }, [isSignedIn]);

    return <div>
        <StylesProvider generateClassName={generateClassName}>
            <Router history={history}>
                <Header isSignedIn={isSignedIn}
                        onSignOut={() => {
                            setIsSignedIn(false);
                            userPool.getCurrentUser().signOut();
                        }}/>

                {"SignedIn: " + isSignedIn}

                <Switch>
                    <Route path="/dashboard">
                        {!isSignedIn && <Redirect to="/"/>}
                        <Dashboard/>
                    </Route>
                    <Route path="/add">
                        {!isSignedIn && <Redirect to="/"/>}
                        <AddData/>
                    </Route>
                    <Route path="/auth/signin">
                        <Signin onSignIn={(username, password) => {
                            onSignIn(username, password, () => {
                                setIsSignedIn(true)
                            });
                        }}/>
                    </Route>
                    <Route path="/auth/confirm">
                        <Confirm onConfirm={onConfirm}/>
                    </Route>
                    <Route path="/auth/signup">
                        <Signup onSignUp={onSignUp}/>
                    </Route>
                    <Route path="/">
                        Sign in to add and see your data!
                    </Route>
                </Switch>
            </Router>
        </StylesProvider>
    </div>
};

export default App;
