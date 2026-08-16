USE delta_app;

CREATE TABLE user(
    id INT PRIMARY KEY,
    username VARCHAR(30) UNIQUE,
    email VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(10) NOT NULL
);

SELECT * FROM user;