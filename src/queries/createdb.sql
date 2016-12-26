-- name: drop-things-table!
DROP TABLE IF EXISTS things;

-- name: create-things-table!
CREATE TABLE things (
  id SERIAL primary key,
  name varchar(255),
  category varchar(255)
);       

-- name: drop-alternatives-table!
DROP TABLE IF EXISTS alternatives;

-- name: create-alternatives-table!
CREATE TABLE alternatives (
  id SERIAL,
  thing_id INTEGER REFERENCES things (id),
  name varchar(255),
  text TEXT,
  price NUMERIC,
  chosen boolean
);

-- name: seed-things!
INSERT INTO things (name, category) VALUES
('mat', 'ätande'),
('skruvar', 'byggande');

-- name: seed-alternatives!
INSERT INTO alternatives (thing_id, name, text, price, chosen) VALUES
(1, 'mjölk', 'från ko', 10, true),
(1, 'smör', 'från ko', 30, false),
(2, 'järn', '', 12, true),
(2, 'mässing', '', 11, true);
