-- Drops the bamazon db if it exists currently --
DROP DATABASE IF EXISTS bamazon
-- Create DB  
CREATE DATABASE bamazon;
-- Specify to Use DB
USE bamazon;

-- Create table and define columns
CREATE TABLE products (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  dept_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2),
  stock_quantity INTEGER(10),
  PRIMARY KEY (id)
);

-- Sample Data Insertion
INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Instant Pot", "Appliances", 88.88, 50);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("GeForce RTX 2060", "Computer Hardware", 299.95, 75);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Vizio 42 Inch OLED TV", "Consumer Electronics", 499.99, 200);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("GoPro Hero HD Camera", "Consumer Electronics", 249.50, 900);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Casio Tough Solar Watch", "Watches", 49.95, 2);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Ray-Ban Polarized Sunglasses", "Sunglasses", 149.99, 10);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Stance Socks", "Clothing", 20.50, 8);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("BBS Super RS Wheels", "Automotive", 1495.50, 0);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Toilet Paper", "Consumables", 9.95, 5000);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Timbuk2 Backpack", "Clothing & Accessories", 159.99, 15);
