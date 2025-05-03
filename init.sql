CREATE DATABASE IF NOT EXISTS movemore;
USE movemore;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    today_calories FLOAT DEFAULT 0,
    target_calories FLOAT DEFAULT 2000
);

CREATE TABLE exercise_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    pose_accuracy FLOAT,
    calories_burned FLOAT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE USER 'moveuser'@'localhost' IDENTIFIED BY 'movepass';
GRANT ALL PRIVILEGES ON movemore.* TO 'moveuser'@'localhost';
FLUSH PRIVILEGES;
