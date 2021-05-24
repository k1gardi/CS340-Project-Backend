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
  
    /* Add a Reviewer */
  
    router.post("/", function (req, res) {
      var context = {};
      console.log(req.body);
      var mysql = req.app.get("mysql");
      var sql =
        "INSERT INTO Reviewer (fName, lName, email) VALUES (?,?,?)";
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
  
    return router;
  })();
  