CREATE TABLE user (
    id VARCHAR(50) UNIQUE PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(30) NOT NULL
);

ALTER TABLE user 
MODIFY username VARCHAR(50);