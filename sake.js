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

//   /* The URI that update data is sent to in order to update a person */

//   router.put("/:id", function (req, res) {
//     var mysql = req.app.get("mysql");
//     console.log(req.body);
//     console.log(req.params.id);
//     var sql =
//       "UPDATE bsg_people SET fname=?, lname=?, homeworld=?, age=? WHERE character_id=?";
//     var inserts = [
//       req.body.fname,
//       req.body.lname,
//       req.body.homeworld,
//       req.body.age,
//       req.params.id,
//     ];
//     sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
//       if (error) {
//         console.log(error);
//         res.write(JSON.stringify(error));
//         res.end();
//       } else {
//         res.status(200);
//         res.end();
//       }
//     });
//   });

//   /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
//   router.delete("/:id", function (req, res) {
//     var mysql = req.app.get("mysql");
//     var sql = "DELETE FROM bsg_people WHERE character_id = ?";
//     var inserts = [req.params.id];
//     sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
//       if (error) {
//         console.log(error);
//         res.write(JSON.stringify(error));
//         res.status(400);
//         res.end();
//       } else {
//         //TODO
//         res.status(202).end();
//       }
//     });
//   });

  return router;
})();
