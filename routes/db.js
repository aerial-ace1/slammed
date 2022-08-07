var mysql = require("mysql");
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.MY_SQL_HOST,
  user: process.env.MY_SQL_USER,
  password: process.env.MY_SQL_PASS,
});

function startup() {
  console.log("Connected!");
  create_check_database();
}

function create_check_database() {
  con.query("CREATE DATABASE IF NOT EXISTS slammed", function (err, result) {
    if (err) throw err;
    console.log("Database created and connected");
    con.query("USE slammed", function (err, result) {
      if (err) throw err;
      create_check_tables();
    });
  });
}

function create_check_tables() {
  let t1 =
    "CREATE TABLE IF NOT EXISTS users(uid varchar(255), name varchar(255), hostel varchar(255), dept char(3), pwd varchar(255), PRIMARY KEY (uid))ENGINE=INNODB;";
  con.query(t1, function (err, result) {
    if (err) throw err;
    let t2 =
      "CREATE TABLE IF NOT EXISTS comment(writer varchar(255) NOT NULL, reader varchar(255) NOT NULL, Q1 LONGBLOB, Q2 LONGBLOB, id int AUTO_INCREMENT NOT NULL PRIMARY KEY, FOREIGN KEY (writer) REFERENCES users(uid) ON DELETE CASCADE, FOREIGN KEY (reader) REFERENCES users(uid) ON DELETE CASCADE)ENGINE=INNODB;";
    con.query(t2, function (err, result) {
      if (err) throw err;
      let t3 =
        "CREATE TABLE IF NOT EXISTS friends(give varchar(255) NOT NULL, got varchar(255) NOT NULL, accepted bool, id int AUTO_INCREMENT NOT NULL PRIMARY KEY, FOREIGN KEY (give) REFERENCES users(uid) ON DELETE CASCADE, FOREIGN KEY (got) REFERENCES users(uid) ON DELETE CASCADE)ENGINE=INNODB;";
      con.query(t3, function (err, result) {
        if (err) throw err;
      });
    });
    console.log("Tables created and connected");
  });
}

function check_username(uid, pwd) {
  //internally chk passwd
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM USERS WHERE uid = ? AND pwd = ?",
      [uid, pwd],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function get_details(uid) {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM USERS WHERE uid = ?", uid, function (err, result) {
      if (err) {
        reject(false);
      } else {
        resolve(result);
      }
    });
  });
}

function get_name(a) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM USERS WHERE NAME like '%${a}%'`,
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function get_comments(uid) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM comment WHERE writer = ? ORDER BY ID desc",
      uid,
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function got_comments(uid) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM comment WHERE reader = ? ORDER BY ID desc",
      uid,
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function check_comments(req) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM comment WHERE writer = ? AND reader = ?;",
      [req.session.auth, req.params.user],
      function (err, result) {
        if (err) {
          reject(false);
          throw err;
        } else {
          resolve(result);
        }
      }
    );
  });
}

function adduser(a) {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO USERS VALUES (?,?,?,?,?)",
      [a.email, a.name, a.hostel, a.department, a.password],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

function id_comments(id) {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM comment WHERE id = ?", id, function (err, result) {
      if (err) {
        reject(false);
      } else {
        resolve(result);
      }
    });
  });
}

function edit_comments(a) {
  return new Promise((resolve, reject) => {
    con.query(
      "UPDATE comment set Q1 = ?,Q2 = ? where id = ?",
      [a.body.Q1, a.body.Q2, a.params.id],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

function add_comments(a) {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO comment(writer,reader,Q1,Q2) VALUES (?,?,?,?)",
      [a.session.auth, a.params.user, a.body.Q1, a.body.Q2],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

function delete_comments(a) {
  return new Promise((resolve, reject) => {
    con.query(
      "DELETE FROM comment WHERE id=?",
      a.params.id,
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

function check_friend(a) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM FRIENDS WHERE give = ? AND got = ?",
      [a.session.auth, a.params.user],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          console.log(result[0]);
          if (result[0] === undefined) {
            con.query(
              "SELECT * FROM FRIENDS WHERE give = ? AND got = ?",
              [a.params.user, a.session.auth],
              function (err, result2) {
                console.log(result2[0]);
                if (result2[0] === undefined) {
                  resolve(2);
                } else {
                  resolve(result2[0].accepted + 3);
                }
              }
            );
          } else {
            resolve(result[0].accepted);
          }
        }
      }
    );
  });
}

function add_friend(a) {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO friends (give,got,accepted) VALUES (?,?,0)",
      [a.session.auth, a.params.user],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

function accept_friend(a) {
  return new Promise((resolve, reject) => {
    con.query(
      "UPDATE friends SET accepted=1 WHERE give=? AND got=?",
      [a.params.user, a.session.auth],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          console.log(result);
          resolve(true);
        }
      }
    );
  });
}

function remove_friend(a) {
  return new Promise((resolve, reject) => {
    con.query(
      "DELETE FROM  friends WHERE give=? AND got=?",
      [a.params.user, a.session.auth],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          console.log(result);
          resolve(true);
        }
      }
    );
  });
}

function find_friend(a) {
  return new Promise((resolve, reject) => {
    const friends = []
    con.query(
      "SELECT * FROM friends WHERE give=? AND accepted=1",
      [a.session.auth],
      function (err, result) {
        if (err) {
          reject(false);
        } else {
          for (i = 0; i < result.length; i++) {
            friends.push(result[i].got)
          }
          console.log(result);
          con.query(
            "SELECT * FROM friends WHERE got=? AND accepted=1",
            [a.session.auth],
            function (err, result2) {
              for (i = 0; i < result2.length; i++) {
                friends.push(result2[i].give)
              }
              console.log(friends);
              resolve(friends);
            })
        }
      }
    );
  });
}

module.exports = {
  startup,
  check_username,
  get_details,
  get_comments,
  got_comments,
  adduser,
  id_comments,
  add_comments,
  check_comments,
  edit_comments,
  delete_comments,
  get_name,
  check_friend,
  add_friend,
  accept_friend,
  remove_friend,
  find_friend,
};
