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

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    appStart();

});

function appStart() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Would you like to [POST] an auction or [BID] on an auction? ",
                name: "userChoice",
                choices: [
                    "POST",
                    "BID",
                    "EXIT"
                ]
            }
        ]).then((res) => {
            if (res.userChoice === "POST") {
                console.log("POST");
                postInquierer();


            } else if (res.userChoice === "BID") {

                console.log("BID");
                viewProductForBid();

            } else {
                console.log("EXIT, BYE");
                connection.end();
            }
        });
}

function postInquierer() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the item you would like to submit? ",
                name: "name"
            },
            {
                type: "input",
                message: "What category would you like to place your auction in? ",
                name: "category"
            },
            {
                type: "input",
                message: "What would you like your starting bid to be? ",
                name: "startingBid"
            }
        ]).then((res) => {
            console.log(res);
            creatProduct(res.name, res.category, res.startingBid);

            console.log("Your auction was created successfully!");

        });
}

function bidInquierer(productObject, productsName) {
    console.log("productObject");
    console.log(productObject);
    if (productsName.length < 1) {
        console.log("There is no item in Auction");
        appStart();
        return;
    }
    inquirer
        .prompt([
            {
                type: "list",
                message: "What auction would you like to place a bid in? ",
                name: "name",
                choices: productsName
            }
        ]).then((res) => {
            let currentBid = 0;
            let maxBid = 0;
            // console.log(res.name);
            // console.log(productObject);
            for (let i = 0; i < productObject.length; i++) {
                if (res.name === productObject[i].name) {
                    currentBid = productObject[i].startingBid;
                    maxBid = productObject[i].maxBid;
                }
            }
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "How much would you like to bid? ",
                        name: "userBid",
                        validate: (userBid) =>{
                            if(!/[0-9]/gi.test(userBid) || /[a-z]/gi.test(userBid)){
                                return "Please enter number";
                            }else{
                                return true;
                            }
                        }
                    }
                ]).then((res) => {
                    if(res.userBid < currentBid || res.userBid < maxBid){
                        console.log("Your bid was too low. Try again...");
                        appStart();
                    }else{
                        console.log("Bid placed successfully!");
                         appStart();
                    }
                });
        });
}

// function bidInquierer(productObject, productsName) {
//     console.log("productObject");
//     console.log(productObject);
//     if (productsName.length < 1) {
//         console.log("There is no item in Auction");
//         appStart();
//         return;
//     }
//     inquirer
//         .prompt([
//             {
//                 type: "list",
//                 message: "What auction would you like to place a bid in? ",
//                 name: "name",
//                 choices: productsName
//             },
//             {
//                 type: "input",
//                 message: "How much would you like to bid? ",
//                 name: "userBid"
//             }
//         ]).then((res) => {
//             console.log(res);
//             console.log(productObject);
//             if()
//             console.log("Bid placed successfully!");

//             appStart();

//         });
// }


////////////////////////////////////////////////////////////////
// SQL
function creatProduct(name, category, startingBid) {
    connection.query(
        "INSERT INTO productLists SET ?",
        {
            name: name,
            category: category,
            startingBid: startingBid,
            maxBid: null
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");

            appStart();
        }
    )
}

function viewProductForBid() {
    let productsName = [];
    connection.query(
        "SELECT * FROM productLists",
        function (err, res) {
            if (err) throw err;
            // console.log(res);
            res.forEach(element => {
                // console.log(element.name);
                productsName.push(element.name);
            });

            bidInquierer(res, productsName);
        });
}

// function updateProduct(name, category, bidding) {
//     let query = connection.query(
//         "INSERT INTO productLists SET ?",
//         {
//             name: name,
//             category: category,
//             startingBid: startingBid,
//             maxBid: null
//         },
//         function (err, res) {
//             if(err) throw err;
//             console.log(res.affectedRows + " product inserted!\n");

//             appStart();
//         }
//     )
// }