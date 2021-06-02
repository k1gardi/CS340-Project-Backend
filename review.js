module.exports = (function () {
    var express = require("express");
    var router = express.Router();

    // Function to get review attributes with joins on reviewer table and sake table
    function getReview(res, mysql, context) {
      mysql.pool.query("SELECT Review.reviewID, Sake.sakeID, Sake.sakeName, Reviewer.personID, CONCAT(Reviewer.fName, ' ', Reviewer.lName) AS reviewerName, Review.rating, Review.comment FROM Review LEFT JOIN Sake ON Review.sakeID = Sake.sakeID LEFT JOIN Reviewer ON Review.personID = Reviewer.personID",
        //"SELECT * FROM Review",
        function (error, results, fields) {
          if (error) {
            res.write(JSON.stringify(error));
            res.end();
          }
          context.review = JSON.stringify(results);
          res.setHeader("Content-Type", "application/json");
          console.log(context);
          res.send(context);
        }
      );
    }

    /* Get all Reviews */
  
    router.get("/", function (req, res) {
      var context = {};
  
      var mysql = req.app.get("mysql");
      getReview(res, mysql, context);
     
    });
  
    /* Adds a Review */
  
    router.post("/", function (req, res) {
      var context = {};
      console.log(req.body);
      var mysql = req.app.get("mysql");
      var sql =
        "INSERT INTO Review (sakeID, personID, rating, comment) VALUES (?,?,?,?)";
      var inserts = [
        req.body.payload.sakeID,
        req.body.payload.personID,
        req.body.payload.rating,
        req.body.payload.comment,
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
  
  /* Update a review */
    
  router.put("/", function (req, res) {
    var context = {};
    console.log(req.body);
    var mysql = req.app.get("mysql");
    var sql =
      `UPDATE Review SET sakeID=?, personID=?, rating=?, comment=? WHERE reviewID=?`;
    var inserts = [
      req.body.data.sakeID,
      req.body.data.personID,
      req.body.data.rating,
      req.body.data.comment,
      req.body.data.reviewID,
    ];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      } else {
        context.review = JSON.stringify(results);
        res.send(context);
        }
    });
  });  

     /* Delete Review */

    router.delete('/', (req, res) => {
      var context = {};
      let id = req.body.reviewID;
      let queryString = `DELETE FROM Review WHERE reviewID = ${id}`;
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
  