DROP DATABASE IF EXISTS auctionlist_db;

CREATE DATABASE auctionlist_db;

USE auctionlist_db;

CREATE TABLE productLists (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NULL,
  category VARCHAR(45) NULL,
  startingBid INT NULL,
  PRIMARY KEY (id)
);