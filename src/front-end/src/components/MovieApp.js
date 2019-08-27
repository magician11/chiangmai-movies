import React, { useEffect, useState, Fragment } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import ReactGA from 'react-ga';
import { CssBaseline, Grid, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import MovieCard from './MovieCard';
// import MovieListings from './movie-listings';
// import Header from './header';
// import Footer from './footer';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3)
  },
  movieItem: {
    marginBottom: theme.spacing(3)
  }
}));

const MovieApp = () => {
  const classes = useStyles();
  const [movieData, setMovieData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        apiKey: 'AIzaSyC_Bv5Apio1PBrO048figZ6i3B_nkccoMw',
        authDomain: 'movies-387bf.firebaseapp.com',
        databaseURL: 'https://movies-387bf.firebaseio.com',
        projectId: 'movies-387bf',
        storageBucket: 'movies-387bf.appspot.com',
        messagingSenderId: '208320671675'
      };
      firebase.initializeApp(config);
      const database = firebase.database();
      const dataSnapshot = await database.ref('/').once('value');
      const firebaseMovieData = dataSnapshot.val();

      // const availableDates = Object.keys(
      //   firebaseMovieData['movie-theatres'].chiangmai['9936']
      // );

      setMovieData(firebaseMovieData);
    };

    // track app views with Google Analytics
    ReactGA.initialize('UA-63340534-3');
    ReactGA.pageview(window.location.pathname);

    fetchData();
  }, []);

  let content;

  if (movieData['movie-details']) {
    content = Object.keys(movieData['movie-details']).map(movieTitle => (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        className={classes.movieItem}
        key={movieTitle}
      >
        <MovieCard movieData={movieData['movie-details'][movieTitle]} />
      </Grid>
    ));
  } else {
    content = (
      <Grid item xs={4}>
        <LinearProgress />
      </Grid>
    );
  }

  return (
    <Fragment>
      <CssBaseline />
      <Header />
      <div className={classes.root}>
        <Grid container justify="center">
          {content}
        </Grid>
      </div>
    </Fragment>
  );
};

// class MovieApp extends Component {
//   constructor() {
//     super();
//     this.state = {
//       movieData: null,
//       targetDate: 'loading...',
//       availableDates: []
//     };
//   }

//   componentDidMount() {
//     // grab data from firebase

//   }

//   handleDateChange(event) {
//     this.setState({ targetDate: event.target.value });
//   }

//   render() {
//     if (this.state.error) {
//       throw this.state.error;
//     }
//     const movieData = this.state.movieData;
//     let content;

//     if (!movieData) {
//       content = (
//         <div className="sk-cube-grid">
//           <div className="sk-cube sk-cube1" />
//           <div className="sk-cube sk-cube2" />
//           <div className="sk-cube sk-cube3" />
//           <div className="sk-cube sk-cube4" />
//           <div className="sk-cube sk-cube5" />
//           <div className="sk-cube sk-cube6" />
//           <div className="sk-cube sk-cube7" />
//           <div className="sk-cube sk-cube8" />
//           <div className="sk-cube sk-cube9" />
//         </div>
//       );
//     } else {
//       content = (
//         <div>
//           <Panel>
//             <Panel.Body>
//               <Row>
//                 <Col xs={6} sm={3}>
//                   <h2>MAYA Mall</h2>
//                 </Col>
//                 <Col className="text-center" sm={6} xsHidden>
//                   <h1>Chiang Mai Movies</h1>
//                 </Col>
//                 <Col xs={6} sm={3} className="text-right">
//                   <p>
//                     Corner of Huay Kaew Rd and Super Highway 11. Across from
//                     Nimmanhaemin.
//                   </p>
//                   <p>
//                     <Glyphicon glyph="map-marker" />{' '}
//                     <a href="https://goo.gl/maps/MJ2KMy2hvnG2">
//                       cinema location
//                     </a>
//                   </p>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col xs={12}>
//                   <Form inline>
//                     <FormGroup controlId="formControlsSelect">
//                       <ControlLabel>Dates</ControlLabel>{' '}
//                       <FormControl
//                         componentClass="select"
//                         placeholder="select"
//                         onChange={this.handleDateChange}
//                       >
//                         {this.state.availableDates.map(date => (
//                           <option key={date} value={date}>
//                             {date}
//                           </option>
//                         ))}
//                       </FormControl>
//                     </FormGroup>
//                   </Form>
//                 </Col>
//               </Row>
//             </Panel.Body>
//           </Panel>
//           <MovieListings
//             movieData={movieData}
//             targetDate={this.state.targetDate}
//           />
//         </div>
//       );
//     }

//     return (
//       <div>
//         <Header date={this.state.targetDate} />
//         <Grid className="movie-app-container">
//           <Row>
//             <Col xs={12}>
//               {content}
//               <Footer />
//             </Col>
//           </Row>
//         </Grid>
//       </div>
//     );
//   }
// }

export default MovieApp;
