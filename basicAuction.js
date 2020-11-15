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
            postInquierer();
            

        }else if(res.userChoice === "BID"){
            console.log("BID");
            bidInquierer();

        }else{
            console.log("EXIT, BYE");
            connection.end();
        }
    });
}

function postInquierer(){
    inquirer
        .prompt([
        {
            type:"input",
            message:"What is the item you would like to submit? ",
            name:"name"
        },
        {
            type:"input",
            message:"What category would you like to place your auction in? ",
            name:"category"
        },
        {
            type:"input",
            message:"What would you like your starting bid to be? ",
            name:"startingBid"
        }
    ]).then((res) => {
        console.log(res);
        creatProduct(res.name, res.category, res.startingBid);

        console.log("Your auction was created successfully!");
        
    });
}

function bidInquierer(){
    inquirer
        .prompt([
        {
            type:"input",
            message:"What auction would you like to place a bid in? ",
            name:"category"
        },
        {
            type:"input",
            message:"How much would you like to bid? ",
            name:"userBid"
        }
    ]).then((res) => {
        console.log(res);
        console.log("Bid placed successfully!");

        appStart();
    });
}


////////////////////////////////////////////////////////////////
// SQL
function creatProduct(name, category, startingBid) {
    let query = connection.query(
        "INSERT INTO productLists SET ?",
        {
            name: name,
            category: category,
            startingBid: startingBid,
            maxBid: null
        },
        function (err, res) {
            if(err) throw err;
            console.log(res.affectedRows + " product inserted!\n");

            appStart();
        }
    )
}