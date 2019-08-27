import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import certifiedFreshIcon from '../icons/certified-fresh.png';
import freshIcon from '../icons/fresh.png';
import rottenIcon from '../icons/splat.png';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: theme.spacing(55)
  },
  media: {
    height: 0,
    paddingTop: '100%'
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
  const [expanded, setExpanded] = React.useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  const { movieData } = props;

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
        <Typography
          variant="body1"
          color="textSecondary"
          component="p"
          gutterBottom
        >
          {movieData.overview}
        </Typography>
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
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        {movieData.consensus && (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            "{movieData.consensus}"
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default MovieCard;
