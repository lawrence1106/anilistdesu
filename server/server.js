const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ani_list",
  waitForConnections: "true",
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/getName", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let sessionName = req.body.params;
  res.send(sessionName);
});

app.get("/getList", (req, res) => {
  pool.query("SELECT * FROM tbl_anilist", (err, results) => {
    res.send(results);
  });
});
let PORT = process.env.PORT || "3000";

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});

app.post("/regUser", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let password = req.body.password;

  bcrypt.hash(password, 10, (err, hash) => {
    let bcryptPass = hash;
    let username = req.body.username;
    let fullName = req.body.fullName;

    pool.query(
      "INSERT INTO tbl_user (username,password,full_name)VALUES(?,?,?)",
      [username, bcryptPass, fullName],
      (err, results) => {
        res.send({ results: results });
      }
    );
  });
});

app.post("/login", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let username = req.body.username;
  let password = req.body.password;

  pool.query(
    "SELECT * FROM tbl_user WHERE username = ?",
    [username],
    (err, results) => {
      if (results.length === 1) {
        let dbUsername = results[0]["username"];
        let dbPassword = results[0]["password"];
        bcrypt.compare(password, dbPassword, (err, result) => {
          if (result) {
            res.send({ authenticated: true, sessionName: dbUsername });
          } else {
            res.send({ authenticated: false });
          }
        });
      } else {
        res.send({ authenticated: 404 });
      }
    }
  );
});

app.post("/getCredentials", (req, res) => {
  let username = req.body.sessionName;

  pool.query(
    "SELECT * FROM tbl_user WHERE username = ?",
    [username],
    (err, results) => {
      res.send({
        fullName: results[0]["full_name"],
      });
    }
  );
});

app.post("/getAnime", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let aniId = req.body.aniId;
  let action = req.body.action;
  let sessionName = req.body.user;

  pool.query(
    "SELECT user_id FROM tbl_user WHERE username = ?",
    [sessionName],
    (err, results) => {
      let userId = results[0]["user_id"];

      if (action === "dropAnime") {
        pool.query(
          "UPDATE tbl_anilist SET ani_status = ? WHERE user_id = ? AND ani_id = ?",
          ["Dropped", userId, aniId],
          (err, results) => {
            if (results.affectedRows === 1) {
              res.send({ result: true });
            } else {
              res.send({ result: false });
            }
          }
        );
      }

      if (action === "getAniDetails") {
        pool.query(
          "SELECT ani_name,ani_status FROM tbl_anilist WHERE ani_id = ? AND user_id = ?",
          [aniId, userId],
          (err, results) => {
            res.send({
              title: results[0]["ani_name"],
              status: results[0]["ani_status"],
            });
          }
        );
      }

      if (action === "Watched") {
        pool.query(
          "UPDATE tbl_anilist SET ani_status = ? WHERE ani_id = ? AND user_id = ? ",
          ["Watched", aniId, userId],
          (err, results) => {
            if (results.affectedRows === 1) {
              res.send({ results: true });
            }
          }
        );
      }

      if (action === "Unwatched") {
        pool.query(
          "UPDATE tbl_anilist SET ani_status = ? WHERE ani_id = ? AND user_id = ?",
          ["Unwatched", aniId, userId],
          (err, results) => {
            if (results.affectedRows === 1) {
              res.send({ results: true });
            }
          }
        );
      }
    }
  );
});

app.post("/addAnime", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let aniTitle = req.body.aniTitle;
  let aniStatus = req.body.status;
  let sessionName = req.body.user;

  pool.query(
    "SELECT user_id FROM tbl_user WHERE username = ?",
    [sessionName],
    (err, results) => {
      let userId = results[0]["user_id"];

      pool.query(
        "INSERT INTO tbl_anilist (ani_name, ani_status, user_id)VALUES(?,?,?)",
        [aniTitle, aniStatus, userId],
        (err, results) => {
          if (results.affectedRows === 1) {
            res.send({ result: true });
          } else {
            res.send({ result: false });
          }
        }
      );
    }
  );
});

app.post("/deleteAnime", (req, res) => {
  let aniId = req.body.aniId;
  let sessionName = req.body.user;

  pool.query(
    "SELECT user_id FROM tbl_user WHERE username =?",
    [sessionName],
    (err, results) => {
      let userId = results[0]["user_id"];
      pool.query(
        "DELETE FROM tbl_anilist WHERE ani_id = ? AND user_id = ?",
        [aniId, userId],
        (err, results) => {
          if (results.affectedRows === 1) {
            res.send({ result: true });
          }
        }
      );
    }
  );
});

app.post("/updateAnime", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let aniId = req.body.aniId;
  let sessionName = req.body.user;
  let title = req.body.title;

  pool.query(
    "SELECT user_id FROM tbl_user WHERE username = ?",
    [sessionName],
    (err, results) => {
      let userId = results[0]["user_id"];

      pool.query(
        "UPDATE tbl_anilist SET ani_name = ? WHERE ani_id = ? AND user_id = ?",
        [title, aniId, userId],
        (err, results) => {
          if (results.affectedRows === 1) {
            res.send({ results: true });
          } else {
            res.send({ results: false });
          }
        }
      );
    }
  );
});

app.post("/getList", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let sessionName = req.body.sessionName;
  let listType = req.body.listType;

  pool.query(
    "SELECT user_id FROM tbl_user WHERE username = ?",
    [sessionName],
    (err, results) => {
      let userId = results[0]["user_id"];

      if (listType === "yourList") {
        pool.query(
          "SELECT * FROM tbl_anilist WHERE user_id = ? AND ani_status != ?",
          [userId, "Dropped"],
          (err, results) => {
            res.send(results);
          }
        );
      }

      if (listType === "droppedList") {
        pool.query(
          "SELECT * FROM tbl_anilist WHERE user_id = ? AND ani_status = ?",
          [userId, "Dropped"],
          (err, results) => {
            res.send(results);
          }
        );
      }
    }
  );

  if (listType === "droppedList") {
  }
});
