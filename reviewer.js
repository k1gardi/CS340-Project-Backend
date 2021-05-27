module.exports = (function () {
  var express = require("express");
  var router = express.Router();

  function getReviewer(res, mysql, context) {
    mysql.pool.query(
      "SELECT * FROM Reviewer",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.reviewer = JSON.stringify(results);
        res.setHeader("Content-Type", "application/json");
        console.log(context);
        res.send(context);
      }
    );
  }

  /* Get all Reviewers */

  router.get("/", function (req, res) {
    var context = {};

    var mysql = req.app.get("mysql");
    getReviewer(res, mysql, context);
  });

  /* Get all reviewer IDs and names*/

  router.get("/dropdown/", function (req, res) {
    var context = {};

    var mysql = req.app.get("mysql");
    mysql.pool.query(
      "SELECT personID, CONCAT(fName, ' ', lName) as reviewerName FROM Reviewer ORDER BY personID ASC",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.reviewers = JSON.stringify(results);
        res.setHeader("Content-Type", "application/json");
        console.log(context);
        res.send(context);
      }
    );
  });

  /* Add a Reviewer */

  router.post("/", function (req, res) {
    var context = {};
    console.log(req.body);
    var mysql = req.app.get("mysql");
    var sql = "INSERT INTO Reviewer (fName, lName, email) VALUES (?,?,?)";
    var inserts = [
      req.body.payload.fName,
      req.body.payload.lName,
      req.body.payload.email,
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

  /* Update a Reviewer */

  router.put("/", function (req, res) {
    var context = {};
    console.log(req.body);
    var mysql = req.app.get("mysql");
    var sql = `UPDATE Reviewer SET fName=?, lName=?, email=? WHERE personID=?`;
    var inserts = [
      req.body.data.fName,
      req.body.data.lName,
      req.body.data.email,
      req.body.data.personID,
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

  /* Delete a Reviewer */

  router.delete("/", (req, res) => {
    var context = {};
    let id = req.body.personID;
    let queryString = `DELETE FROM Reviewer WHERE personID = ${id}`;
    console.log(queryString);

    var mysql = req.app.get("mysql");
    mysql.pool.query(queryString, (error, results, fields) => {
      if (error) {
        res.write(JSON.stringify(error));
        res.status(400);
        res.end();
      } else {
        context.sake = JSON.stringify(results);
        res.send(context);
      }
    });
  });

  return router;
})();
