module.exports = (function () {
  var express = require("express");
  var router = express.Router();

  function getSake(res, mysql, context) {
    mysql.pool.query(
      "SELECT Sake.sakeID, Sake.sakeName, Company.companyName, Sake.region, Sake.style, Sake.cultivar, (SELECT AVG(Review.rating) from Review where Review.sakeID = Sake.sakeID) AS averageRating FROM Sake LEFT JOIN Company ON Sake.companyID = Company.companyID",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.sake = JSON.stringify(results);
        res.setHeader("Content-Type", "application/json");
        console.log(context);
        res.send(context);
      }
    );
  }

/* Find sake based on search filter and a given string in the req */
function getSomeSake(filter, res, mysql, context) {
  //
  var query = `SELECT Sake.sakeID, Sake.sakeName, Company.companyName, Sake.region, Sake.style, Sake.cultivar, (SELECT AVG(Review.rating) from Review where Review.sakeID = Sake.sakeID) AS averageRating FROM Sake LEFT JOIN Company ON Sake.companyID = Company.companyID WHERE ${filter.col} REGEXP "${filter.q}";`;
  console.log(query);

  mysql.pool.query(query, function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.sake = JSON.stringify(results);
    res.setHeader("Content-Type", "application/json");
    console.log(context);
    res.send(context);
  });
}

  /* Get sake */

  router.get("/", function (req, res) {
    var context = {};
    var mysql = req.app.get("mysql");
    console.log(req.query);
    // Check if query contains filter criteria
    if (Object.keys(req.query).length === 0) {
      getSake(res, mysql, context);
    }
    // Else this is a filtered request
    else {
      filter = req.query
      getSomeSake(filter, res, mysql, context);
    }
   
  });

  /* Get all Sake IDs and names*/

  router.get("/dropdown/", function (req, res) {
    var context = {};

    var mysql = req.app.get("mysql");
    mysql.pool.query(
      "SELECT sakeID, sakeName FROM Sake ORDER BY sakeID ASC",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.sake = JSON.stringify(results);
        res.setHeader("Content-Type", "application/json");
        console.log(context);
        res.send(context);
      }
    );
  });


    /* Update a sake */
    
    router.put("/", function (req, res) {
      var context = {};
      console.log(req.body);
      var mysql = req.app.get("mysql");
      var sql =
        `UPDATE Sake SET sakeName=?, companyID=?, region=?, style=?, cultivar=? WHERE sakeID=?`;
      var inserts = [
        req.body.data.sakeName,
        req.body.data.companyID,
        req.body.data.region,
        req.body.data.style,
        req.body.data.cultivar,
        req.body.data.sakeID,
      ];
      sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
          console.log(error);
          res.write(JSON.stringify(error));
          res.end();
        } else {
          context.sake = JSON.stringify(results);
          res.send(context);
          }
      });
    });

  /* Adds a sake */

  router.post("/", function (req, res) {
    var context = {};
    console.log(req.body);
    var mysql = req.app.get("mysql");
    var sql =
      "INSERT INTO Sake (sakeName, companyID, region, style, cultivar) VALUES (?,?,?,?,?)";
    var inserts = [
      req.body.payload.sakeName,
      req.body.payload.companyID,
      req.body.payload.region,
      req.body.payload.style,
      req.body.payload.cultivar,
    ];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.send(context);
      }
    });
  });


  /* Delete Sake */

  router.delete('/', (req, res) => {
    var context = {};
    let id = req.body.sakeID;
    let queryString = `DELETE FROM Sake WHERE sakeID = ${id}`;
    console.log(queryString);

    var mysql = req.app.get("mysql");
    mysql.pool.query(
      queryString,
      (error, results, fields) => {
        if (error) {
          res.write(JSON.stringify(error));
          res.status(400);
          res.end();
        } else{
        context.sake = JSON.stringify(results);
        res.send(context);
        }
      }
    );
  });



  return router;
})();
