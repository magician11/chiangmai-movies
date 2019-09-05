import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Button
} from '@material-ui/core';
import { GetState } from './AppState';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  location: {
    marginRight: theme.spacing(3)
  }
}));

const MovieBar = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [{ selectedDate, movieListings }, dispatch] = GetState();

  const handleMenuItemClick = newDateSelected => {
    dispatch({
      type: 'setSelectedDate',
      newDate: newDateSelected
    });
    setAnchorEl(null);
  };

  const handleButtonClick = event => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Chiang Mai Movies
          </Typography>
          <Typography className={classes.location}>Maya Mall</Typography>
          {selectedDate && (
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleButtonClick}
              variant="outlined"
              color="inherit"
            >
              {selectedDate}
            </Button>
          )}
          {movieListings && (
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {Object.keys(movieListings).map(date => (
                <MenuItem
                  key={date}
                  selected={date === selectedDate}
                  onClick={() => handleMenuItemClick(date)}
                >
                  {date}
                </MenuItem>
              ))}
            </Menu>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default MovieBar;
