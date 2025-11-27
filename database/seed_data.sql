-- ------------------------------------------------------
-- DATABASE: flipcart
-- ------------------------------------------------------
CREATE DATABASE IF NOT EXISTS flipcart;
USE flipcart;

-- ------------------------------------------------------
-- TABLE: users  (for normal customers)
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default test user (password: 123456)
INSERT INTO users (name, email, password) VALUES
('Test User', 'user@test.com', '$2y$10$6wXHQ8wBUB8Ev4iRqTrkY.MQYpL4uS0KkCzExKMEGJHgcZFw5V6pK');

-- ------------------------------------------------------
-- TABLE: admin  (for admin login + profile)
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin (password: admin123)
INSERT INTO admin (name, email, password) VALUES
('Admin', 'admin@flipcart.com', '$2y$10$2mRM22t9npNmj6myUNG/N.pGmB7N6s7omJwzEzz8zNuh6DlqQHA2K');

-- ------------------------------------------------------
-- TABLE: categories
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    icon VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample category
INSERT INTO categories (name, emoji, icon) VALUES
('Fashion', '👗', 'cat_sample.png');

-- ------------------------------------------------------
-- TABLE: products
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(200),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample product
INSERT INTO products (name, category, price, stock, image, description) VALUES
('Blue Jeans', 'Fashion', 799.00, 10, 'sample.png', 'Comfort denim jeans');

-- ------------------------------------------------------
-- TABLE: cart  (user OR guest id)
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id),
    INDEX(product_id)
);

-- ------------------------------------------------------
-- TABLE: orders  (main order table)
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id)
);

-- ------------------------------------------------------
-- TABLE: order_items
-- ------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    INDEX(order_id),
    INDEX(product_id)
);

