module.exports = (function () {
  var express = require("express");
  var router = express.Router();

  function getCompany(res, mysql, context) {
    mysql.pool.query(
      "SELECT * FROM Company",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.company = JSON.stringify(results);
        res.setHeader("Content-Type", "application/json");
        console.log(context);
        res.send(context);
      }
    );
  }

  /* Get all Companies */

  router.get("/", function (req, res) {
    var context = {};

    var mysql = req.app.get("mysql");
    getCompany(res, mysql, context);
  });

  /* Get all Company IDs and names*/

  router.get("/dropdown/", function (req, res) {
    var context = {};

    var mysql = req.app.get("mysql");
    mysql.pool.query(
      "SELECT companyID, companyName FROM Company",
      function (error, results, fields) {
        if (error) {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.company = JSON.stringify(results);
        res.setHeader("Content-Type", "application/json");
        console.log(context);
        res.send(context);
      }
    );
  });

  /* Adds a Company */

  router.post("/", function (req, res) {
    var context = {};
    console.log(req.body);
    var mysql = req.app.get("mysql");
    var sql =
      "INSERT INTO Company (companyName, location, year) VALUES (?,?,?)";
    var inserts = [
      req.body.payload.companyName,
      req.body.payload.location,
      req.body.payload.year,
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

  /* Update a Company */

  router.put("/", function (req, res) {
    var context = {};
    console.log(req.body);
    var mysql = req.app.get("mysql");
    var sql = `UPDATE Company SET companyName=?, location=?, year=? WHERE companyID=?`;
    var inserts = [
      req.body.data.companyName,
      req.body.data.location,
      req.body.data.year,
      req.body.data.companyID,
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

  /* Delete a Company */

  router.delete("/", (req, res) => {
    var context = {};
    let id = req.body.companyID;
    let queryString = `DELETE FROM Company WHERE companyID = ${id}`;
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
