import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {createGenerateClassName, StylesProvider} from '@material-ui/core/styles';
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool} from "amazon-cognito-identity-js";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Confirm from "./components/Confirm";
import Header from "./components/Header";
import AddData from "./components/AddData";
import Dashboard from "./components/Dashboard";
import compareYourselfApi from './api/compare-yourself-api';

const poolData = {
    UserPoolId: 'us-west-2_Yedy3Sv7q',
    ClientId: '2gje8cfuvcllig1l85h0k1h4l5'
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
        // history.push("/auth/confirm")
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
        // history.push("/auth/signin")
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
            console.log('ID Token: ' + result.getIdToken().getJwtToken());
            // history.push("/dashboard");

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
            console.log('session id: ' + session.getIdToken());

            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes(function (err, attributes) {
                if (err) {
                    // Handle error
                    console.log(err);
                } else {
                    // Do something with attributes
                    // console.log(attributes);
                    return cognitoUser
                }
            });
        });
    }
}

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        console.log(getAuthenticatedUser());

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

                {"SignedIn: " + isSignedIn}

                <Switch>
                    <Route path="/dashboard">
                        {/*{!isSignedIn && <Redirect to="/"/>}*/}
                        <Dashboard onDelete={() => {
                            console.log('Delete')
                        }}/>
                    </Route>
                    <Route path="/add">
                        {/*{!isSignedIn && <Redirect to="/"/>}*/}
                        <AddData onAddData={(age, height, income) => {
                            userPool.getCurrentUser().getSession(async (err, session) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }

                                const payload = {
                                    person: {
                                        age: +age, height: +height, income: +income
                                    }
                                }

                                const headers = {
                                    'Content-Type': 'application/json',
                                    'Authorization': session.getIdToken().getJwtToken()
                                }

                                const response = await compareYourselfApi.post('/compare-yourself', payload, {headers});
                                console.log(response);
                            });
                        }
                        }/>
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
            </BrowserRouter>
        </StylesProvider>
    </div>
};

export default App;
