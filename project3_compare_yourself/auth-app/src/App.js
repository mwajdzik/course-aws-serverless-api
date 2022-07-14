import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {createGenerateClassName, StylesProvider} from '@material-ui/core/styles';

import Signin from "./components/Signin";
import Signup from "./components/Signup";

const generateClassName = createGenerateClassName({
    productionPrefix: 'au'
});

const onSignIn = () => {
}
const onSignUp = () => {
}

const App = () => {
    return <div>
        <StylesProvider generateClassName={generateClassName}>
            <BrowserRouter>
                <Switch>
                    <Route path="/auth/signin">
                        <Signin onSignIn={onSignIn}/>
                    </Route>
                    <Route path="/auth/signup">
                        <Signup onSignUp={onSignUp}/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </StylesProvider>
    </div>
};

export default App;
