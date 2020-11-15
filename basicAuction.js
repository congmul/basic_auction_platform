const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "jung5424",
    database: "auctionList_db"
});

connection.connect((err) =>{
    if(err) throw err;
    console.log("connected as id "+ connection.threadId + "\n");

    appStart();
    
});

function appStart(){
    inquirer
        .prompt([
        {
            type:"list",
            message:"Would you like to [POST] an auction or [BID] on an auction? ",
            name:"userChoice",
            choices:[
                "POST",
                "BID",
                "EXIT"
            ]
        }
    ]).then((res) => {
        if(res.userChoice === "POST"){
            console.log("POST");
            appStart();

        }else if(res.userChoice === "BID"){
            console.log("BID");
            appStart();

        }else{
            console.log("EXIT, BYE");
            connection.end();
        }
    });
}