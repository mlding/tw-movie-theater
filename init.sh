#! /bin/bash

cd /Users/mlding/Documents/JS/tw-movie-theater/theater.db
sqlite3 theater.db

DROP TABLE IF EXISTS movies;
CREATE TABLE movies(
   id int  PRIMARY KEY not null,
   alt text not null,
   images text not null,
   year int not null,
   directors text not null,
   title text not null,
   casts text not null,
   genres text not null
);

DROP TABLE IF EXISTS genres;
CREATE TABLE genres(
   id int  PRIMARY KEY not null,
   name text not null
);

DROP TABLE IF EXISTS movies_enres;
CREATE TABLE movies_genres(
   id int  PRIMARY KEY not null,
   movie_id int not null,
   genre_id int not null
);

DROP TABLE IF EXISTS person;
CREATE TABLE person(
   id int  PRIMARY KEY not null,
   name text not null,
   surname text not null,
   age int not null
);

done
