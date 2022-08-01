const { reject } = require('async');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql123"
});

function startup(){
    console.log("Connected!");
    create_check_database();
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
        //let t2 = "INSERT INTO comment (writer,reader,Q1,Q2) VALUES('106121007@g.com', '106121008@g.com', 'Love you :)' , 'Love you more :)');"
        con.query(t2, function (err, result) {
            if (err) throw err;
        });
        console.log("Tables created and connected");
    });
}

function check_username(uid,pwd){
    //internally chk passwd
        return new Promise((resolve,reject) => {
            con.query("SELECT * FROM USERS WHERE uid = ? AND pwd = ?",[uid,pwd], function (err,result){
            if (err){
                console.log(err)
                reject(err)
            }
            else{
                console.log(result)
                resolve(result);
            }
            })
        })
}

function get_details(uid){

    return new Promise((resolve,reject) => {
        con.query("SELECT * FROM USERS WHERE uid = ?",uid, function (err,result){
            if (err){
                console.log(err)
                reject(err)
                throw err;
            }
            else {
                console.log(result)
                resolve(result)
            }
        })
    })
}

function get_comments(uid){

    return new Promise((resolve,reject) => {
        con.query("SELECT * FROM comment WHERE writer = ?",uid, function (err,result){
            if (err){
                console.log(err)
                reject(err)
                throw err;
            }
            else {
                console.log(result)
                resolve(result)
            }
        })
    })
}

function got_comments(uid){

    return new Promise((resolve,reject) => {
        con.query("SELECT * FROM comment WHERE reader = ?",uid, function (err,result){
            if (err){
                console.log(err)
                reject(err)
                throw err;
            }
            else {
                console.log(result)
                resolve(result)
            }
        })
    })
}

module.exports = {startup,check_username,get_details,get_comments,got_comments};