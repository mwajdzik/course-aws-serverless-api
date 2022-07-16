import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import compareYourselfApi from "../api/compare-yourself-api";

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

export default function Dashboard({items, userPool, callback}) {
    const classes = useStyles();

    const renderedItems = items.map((item) => {
        return <ListItem key={item.age}>
            <ListItemAvatar>
                <Avatar>
                    <CheckCircleOutlineIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`Age: ${item.age}, Height: ${item.height}, Income: ${item.income}`}/>
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => {
                    userPool.getCurrentUser().getSession(async (err, session) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        const headers = {
                            'Authorization': session.getIdToken().getJwtToken()
                        }

                        const response = await compareYourselfApi.delete('/dev/compare-yourself?accessToken=' + session.getAccessToken().getJwtToken(), {headers});
                        console.log(response);

                        callback();
                    });
                }}>
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    });

    return (
        <Container component="main" maxWidth="sm">
            <div className={classes.paper}>
                <List dense={false}>
                    {renderedItems}
                </List>
            </div>
        </Container>
    );
}
