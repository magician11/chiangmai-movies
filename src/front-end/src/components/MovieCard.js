import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  Button,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import { Movie, Link } from '@material-ui/icons';

import certifiedFreshIcon from '../icons/certified-fresh.png';
import freshIcon from '../icons/fresh.png';
import rottenIcon from '../icons/splat.png';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: theme.spacing(55)
  },
  media: {
    height: 750
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
}));

const MovieCard = props => {
  const classes = useStyles();

  const { movieData, showTimes } = props;

  let iconFromClass;
  switch (movieData.meterClass) {
    case 'certified_fresh':
      iconFromClass = certifiedFreshIcon;
      break;
    case 'fresh':
      iconFromClass = freshIcon;
      break;
    case 'rotten':
      iconFromClass = rottenIcon;
      break;
    default:
      iconFromClass = '';
  }

  const niceLanguage = languageCode => {
    switch (languageCode) {
      case 'ENG':
        return 'English';
      case 'TH':
        return 'Thai';
      case 'JP':
        return 'Japanese';
      default:
        return languageCode;
    }
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar aria-label="recipe" src={iconFromClass} />}
        title={movieData.title}
        subheader={
          movieData.meterScore
            ? `${movieData.meterScore}% (Rotten Tomatoes Score)`
            : 'No Rotten Tomatoes Score Found'
        }
      />
      <CardMedia
        className={classes.media}
        image={
          movieData.posterImage
            ? movieData.posterImage
            : 'https://picsum.photos/440?grayscale'
        }
        title={movieData.title}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {movieData.overview}
        </Typography>
      </CardContent>
      <CardContent>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Language</TableCell>
              <TableCell align="right">Showtimes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showTimes.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {niceLanguage(row.language)}
                </TableCell>
                <TableCell align="right">
                  {row.times.replace(/,/g, ', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardContent>
        {movieData.actors && (
          <Typography variant="body2" gutterBottom>
            Actors: {movieData.actors.join(', ')}
          </Typography>
        )}
        {movieData.runtime && (
          <Typography variant="body2" gutterBottom>
            Runtime: {movieData.runtime} minutes
          </Typography>
        )}
      </CardContent>
      {movieData.consensus && (
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div">
            <blockquote>"{movieData.consensus}"</blockquote>
          </Typography>
        </CardContent>
      )}
      <CardActions disableSpacing>
        {movieData.trailer && (
          <Button
            size="small"
            color="primary"
            href={movieData.trailer}
            startIcon={<Movie />}
          >
            Trailer
          </Button>
        )}
        {movieData.url && (
          <Button
            size="small"
            color="primary"
            href={movieData.url}
            startIcon={<Link />}
          >
            Rotten Tomatoes
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default MovieCard;
