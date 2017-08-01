const orm = require("orm");
const sqlite3 = require("sqlite3");
const express = require("express");
const app = express();
const port = 3001;
const dbConnection = "sqlite:/Users/mlding/Documents/JS/sqlite-autoconf-3190300/test.db";

app.use(express.static(__dirname));

app.use(orm.express(dbConnection, {
  define: function(db, models, next) {
    models.person = db.define("person", {
        name      : String,
        surname   : String,
        age       : Number, // FLOAT
        male      : Boolean,
        continent : [ "Europe", "America", "Asia", "Africa", "Australia", "Antarctica" ], // ENUM type
        photo     : Buffer, // BLOB/BINARY
        data      : Object // JSON encoded
    }, {
        methods: {
            fullName: function () {
                return this.name + ' ' + this.surname;
            }
        },
        validations: {
            age: orm.enforce.ranges.number(18, undefined, "under-age")
        }
    });

    db.sync(function(err) {
        if (err) throw err;
        // add a row to the person table
        models.person.create({ name: "John", surname: "Doe", age: 27 }, function(err) {
            if (err) throw err;
            });
    });

  }
}));

app.listen(port, () => {
  console.log('server successfully started, listening on port ' + port);
});

app.get("/", function (req, res) {
  console.log(req);
  console.log(res);
  // req.models is a reference to models used above in define()
  req.models.person.find({ surname: "Doe" }, function(people) {
    console.log("People found: %d", people.length);
    console.log("First person: %s, age %d", people[0].fullName(), people[0].age);

    people[0].age = 16;
    people[0].save(function (err) {});
  });
});
