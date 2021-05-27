module.exports = (function () {
    var express = require("express");
    var router = express.Router();
  
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
  
  //   /* Find people whose fname starts with a given string in the req */
  //   function getPeopleWithNameLike(req, res, mysql, context, complete) {
  //     //sanitize the input as well as include the % character
  //     var query =
  //       "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " +
  //       mysql.pool.escape(req.params.s + "%");
  //     console.log(query);
  
  //     mysql.pool.query(query, function (error, results, fields) {
  //       if (error) {
  //         res.write(JSON.stringify(error));
  //         res.end();
  //       }
  //       context.people = results;
  //       complete();
  //     });
  //   }
  
  //   function getPerson(res, mysql, context, id, complete) {
  //     var sql =
  //       "SELECT character_id as id, fname, lname, homeworld, age FROM bsg_people WHERE character_id = ?";
  //     var inserts = [id];
  //     mysql.pool.query(sql, inserts, function (error, results, fields) {
  //       if (error) {
  //         res.write(JSON.stringify(error));
  //         res.end();
  //       }
  //       context.person = results[0];
  //       complete();
  //     });
  //   }
  
    /* Get all Reviews */
  
    router.get("/", function (req, res) {
      var context = {};
  
      var mysql = req.app.get("mysql");
      getReview(res, mysql, context);
     
    });
  
  //   /*Display all people from a given homeworld. Requires web based javascript to delete users with AJAX*/
  //   router.get("/filter/:homeworld", function (req, res) {
  //     var callbackCount = 0;
  //     var context = {};
  //     context.jsscripts = [
  //       "deleteperson.js",
  //       "filterpeople.js",
  //       "searchpeople.js",
  //     ];
  //     var mysql = req.app.get("mysql");
  //     getPeoplebyHomeworld(req, res, mysql, context, complete);
  //     getPlanets(res, mysql, context, complete);
  //     function complete() {
  //       callbackCount++;
  //       if (callbackCount >= 2) {
  //         res.render("people", context);
  //       }
  //     }
  //   });
  
  //   /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
  //   router.get("/search/:s", function (req, res) {
  //     var callbackCount = 0;
  //     var context = {};
  //     context.jsscripts = [
  //       "deleteperson.js",
  //       "filterpeople.js",
  //       "searchpeople.js",
  //     ];
  //     var mysql = req.app.get("mysql");
  //     getPeopleWithNameLike(req, res, mysql, context, complete);
  //     getPlanets(res, mysql, context, complete);
  //     function complete() {
  //       callbackCount++;
  //       if (callbackCount >= 2) {
  //         res.render("people", context);
  //       }
  //     }
  //   });
  
  //   /* Display one person for the specific purpose of updating people */
  
  //   router.get("/:id", function (req, res) {
  //     callbackCount = 0;
  //     var context = {};
  //     context.jsscripts = ["selectedplanet.js", "updateperson.js"];
  //     var mysql = req.app.get("mysql");
  //     getPerson(res, mysql, context, req.params.id, complete);
  //     getPlanets(res, mysql, context, complete);
  //     function complete() {
  //       callbackCount++;
  //       if (callbackCount >= 2) {
  //         res.render("update-person", context);
  //       }
  //     }
  //   });
  
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
  
    // /* The URI that update data is sent to in order to update a person */
  
    // router.put("/:id", function (req, res) {
    //   var mysql = req.app.get("mysql");
    //   console.log(req.body);
    //   console.log(req.params.id);
    //   var sql =
    //     "UPDATE bsg_people SET fname=?, lname=?, homeworld=?, age=? WHERE character_id=?";
    //   var inserts = [
    //     req.body.fname,
    //     req.body.lname,
    //     req.body.homeworld,
    //     req.body.age,
    //     req.params.id,
    //   ];
    //   sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    //     if (error) {
    //       console.log(error);
    //       res.write(JSON.stringify(error));
    //       res.end();
    //     } else {
    //       res.status(200);
    //       res.end();
    //     }
    //   });
    // });

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

    // /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
    // router.delete("/:id", function (req, res) {
    //   var mysql = req.app.get("mysql");
    //   var sql = "DELETE FROM bsg_people WHERE character_id = ?";
    //   var inserts = [req.params.id];
    //   sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    //     if (error) {
    //       console.log(error);
    //       res.write(JSON.stringify(error));
    //       res.status(400);
    //       res.end();
    //     } else {
    //       //TODO
    //       res.status(202).end();
    //     }
    //   });
    // });
  

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
  