import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContentText
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
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
  },
  infoIcon: {
    marginLeft: theme.spacing(2)
  },
  dialogContent: {
    padding: theme.spacing(3)
  }
}));

const MovieBar = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
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

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <IconButton
            aria-label="about this app"
            aria-controls="info-appbar"
            aria-haspopup="true"
            onClick={() => setShowAboutDialog(true)}
            color="inherit"
            className={classes.infoIcon}
          >
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog
        onClose={() => setShowAboutDialog(false)}
        aria-labelledby="simple-dialog-title"
        open={showAboutDialog}
      >
        <DialogTitle id="simple-dialog-title">
          About Chiang Mai Movies
        </DialogTitle>
        <DialogContentText className={classes.dialogContent}>
          This app merges movie showtimes from the{' '}
          <a href="https://goo.gl/maps/eko9pf2xbL3NVUnq6">Maya Mall</a> cinema
          in Chiang Mai, Thailand with{' '}
          <a href="https://rottentomatoes.com/">Rotten Tomatoes</a> metadata.
        </DialogContentText>
        <DialogContentText className={classes.dialogContent}>
          Any questions, email{' '}
          <a href="mailto:support@andrewgolightly.com">
            support@andrewgolightly.com
          </a>
        </DialogContentText>
      </Dialog>
    </div>
  );
};

export default MovieBar;
