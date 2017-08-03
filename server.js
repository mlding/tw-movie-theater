const orm = require("orm");
const sqlite3 = require("sqlite3");
const express = require("express");
const app = express();
const port = 3001;
const dbConnection = `sqlite://${__dirname}/movies.db`;

app.use(express.static(__dirname));

//String,Boolean,Number,Date,Object,Buffer
app.use(orm.express(dbConnection, {

  define: function(db, models, next) {

    db.on('error', error => {
      console.log(error);
    });

    models.movies = db.define("movie", {
        id: Number,
        alt: String,
        year: Number,
        title: String,
        rating: String,
        original_title: String,
        directors: String,
        casts: String,
        image: String
    });

    models.genres = db.define("genre", {
        id: Number,
        name: String
    });

    models.moviesGenres = db.define("movie_genre", {
        id: Number,
        movie_id: Number,
        genre_id: Number
    });

    next();
  }
}));

// Person.find()   // or Person.all()
// Person.find({ surname: orm.like("Gr" + "%") })
app.get("/", (req, res) => {
  console.log('request');
  // res.sendFile();
});

app.get("/movies", (req, res) => {
  const movieId = req.query.id;
  const movieTitle = req.query.title;

  let searchCondition = {};
  if(movieId) searchCondition.id = movieId;
  if(movieTitle) searchCondition.title = movieTitle;

  req.models.movies.find(searchCondition, (err, movies) => {
    res.send(JSON.stringify(movies));
  })
});

app.get("/genres", (req, res) => {
  const genresId = req.query.genres_id;

  if(genresId) {
    req.models.moviesGenres.find({'genre_id': genresId}, (err, moviesGenres) => {
        let movieIds = [];
        moviesGenres.forEach(movieGenre => {
          movieIds.push(movieGenre.movie_id);
        });

        if(movieIds.length > 0) {
          req.models.movies.find({id: movieIds}, (err, movies) => {
            res.send(JSON.stringify(movies));
          });
        } else {
          res.send('No movies in this genre!');
        }
      })
  } else {
      req.models.genres.find({}, (err, genres) => {
        res.send(JSON.stringify(genres));
      })
  }
});

app.get("/movies_genres/:movie_id", (req, res) => {
  const movieId = req.params.movie_id;

  req.models.moviesGenres.find({'movie_id': movieId}, (err, moviesGenres) => {
    let genreIds = [], movieIds = [];
    moviesGenres.forEach(movieGenre => {
      genreIds.push(movieGenre.genre_id);
    });

    req.models.moviesGenres.find({'genre_id': genreIds}, (err, mgs) => {
      mgs.forEach(mg => {
        movieIds.push(mg.movie_id);
      });

      if(movieIds.length > 0) {
        req.models.movies.find({id: movieIds}, (err, movies) => {
          res.send(JSON.stringify(movies));
        });
      } else {
        res.send('No recommended movies for you!');
      }
    });
  })
});

app.listen(port, () => {
  console.log('server successfully started, listening on port ' + port);
});
