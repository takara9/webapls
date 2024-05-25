DROP DATABASE IF EXISTS  petshopdb;

CREATE DATABASE petshopdb;

USE petshopdb;

CREATE USER 'petshop'@'%' IDENTIFIED BY 'petshop';

GRANT ALL PRIVILEGES ON petshopdb.* TO 'petshop'@'%';

CREATE TABLE animals (
     id MEDIUMINT NOT NULL AUTO_INCREMENT,
     name CHAR(30) NOT NULL,
     PRIMARY KEY (id)
);

INSERT INTO animals (name) VALUES
    ('dog'),('cat'),('penguin'),
    ('lax'),('whale'),('ostrich');

SELECT * FROM animals;

