import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MoneyIcon from '@material-ui/icons/Money';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function AddData({onAddData}) {
    const classes = useStyles();

    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [income, setIncome] = useState("");

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <MoneyIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Add Your Data
                </Typography>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className={classes.form}
                    noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                onChange={(e) => {
                                    setAge(e.target.value)
                                }}
                                autoComplete="age"
                                name="age"
                                variant="outlined"
                                required
                                fullWidth
                                id="age"
                                label="Age"
                                autoFocus/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => {
                                    setHeight(e.target.value)
                                }}
                                variant="outlined"
                                required
                                fullWidth
                                name="height"
                                label="Height"
                                type="height"
                                id="height"/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => {
                                    setIncome(e.target.value)
                                }}
                                variant="outlined"
                                required
                                fullWidth
                                name="income"
                                label="Income"
                                type="income"
                                id="income"/>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={() => {
                                onAddData(age, height, income);
                            }}>
                            Add
                        </Button>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
