var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql123"
});

function ini(){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        create_check_database();
    });
}

function create_check_database(){
    con.query("CREATE DATABASE IF NOT EXISTS slammed", function (err, result) {
        if (err) throw err;
        console.log("Database created and connected");
        con.query('USE slammed', function (err, result) {
            if (err) throw err;
            create_check_tables();
        });
    });
}

function create_check_tables(){
    
    let t1 = "CREATE TABLE IF NOT EXISTS users(uid varchar(255), name varchar(255), hostel varchar(255), dept char(3), pwd varchar(255), PRIMARY KEY (uid))ENGINE=INNODB;"
    con.query(t1, function (err, result) {
        if (err) throw err;
        let t2 = "CREATE TABLE IF NOT EXISTS comment(writer varchar(255) NOT NULL, reader varchar(255) NOT NULL, Q1 LONGBLOB, Q2 LONGBLOB, id int AUTO_INCREMENT NOT NULL PRIMARY KEY, FOREIGN KEY (writer) REFERENCES users(uid) ON DELETE CASCADE, FOREIGN KEY (reader) REFERENCES users(uid) ON DELETE CASCADE)ENGINE=INNODB;"
        con.query(t2, function (err, result) {
            if (err) throw err;
        });
        console.log("Tables created and connected");
    });
}

module.exports = {ini};