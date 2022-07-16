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

export default function Dashboard({}) {
    const classes = useStyles();

    const items = [
        {age: 30, height: 180, income: 2500},
        {age: 40, height: 190, income: 3500},
        {age: 23, height: 170, income: 1500},
        {age: 50, height: 160, income: 2900},
    ]

    const renderedItems = items.map((item) => {
        return <ListItem key={item.age}>
            <ListItemAvatar>
                <Avatar>
                    <CheckCircleOutlineIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`Age: ${item.age}, Height: ${item.height}, Income: ${item.income}`}/>
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => console.log("delete")}>
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    });

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <List dense={false}>
                    {renderedItems}
                </List>
            </div>
        </Container>
    );
}
