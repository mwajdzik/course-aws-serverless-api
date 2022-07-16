import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link, useHistory} from 'react-router-dom';
import {CognitoUser} from "amazon-cognito-identity-js";
import {Collapse} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link to="/">Your Website</Link> {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    '@global': {
        a: {
            textDecoration: 'none',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    Alert: {
        marginBottom: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Confirm({userPool}) {
    const classes = useStyles();
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");

    const [errorOpened, setErrorOpened] = React.useState(true);
    const [error, setError] = useState("");

    return (
        <Container component="main" maxWidth="sm">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Confirm Code
                </Typography>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className={classes.form}
                    noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                                autoComplete="username"
                                name="username"
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Userame"
                                autoFocus/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                onChange={(e) => {
                                    setCode(e.target.value)
                                }}
                                autoComplete="code"
                                name="code"
                                variant="outlined"
                                required
                                fullWidth
                                id="code"
                                label="Confirmation Code"
                                autoFocus/>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => {
                            const userData = {Username: username, Pool: userPool};
                            const cognitoUser = new CognitoUser(userData);

                            cognitoUser.confirmRegistration(code, true, function (err, result) {
                                if (err) {
                                    setError(err.message || JSON.stringify(err));
                                    setErrorOpened(true);
                                    return;
                                }

                                console.log('Result: ' + result);
                                history.push("/auth/signin")
                            });
                        }}>
                        Confirm
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/auth/signin">Already have an account? Sign in</Link>
                        </Grid>
                    </Grid>
                </form>
            </div>

            {error ? <Collapse in={errorOpened}>
                <Alert severity="error" className={classes.Alert} action={
                    <IconButton aria-label="close" color="inherit" size="small" onClick={() => {
                        setError("");
                        setErrorOpened(false);
                    }}>
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                }>
                    <AlertTitle>Error</AlertTitle>{error}
                </Alert>
            </Collapse> : null}

            <Box mt={5}>
                <Copyright/>
            </Box>
        </Container>
    );
}
