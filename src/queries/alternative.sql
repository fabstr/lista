-- name: select-alternative
SELECT * FROM alternatives WHERE id = :id;

-- name: select-alternatives-by-things
SELECT * FROM alternatives WHERE thing_id IN (:thingids);

-- name: select-alternatives-by-thing
SELECT * FROM alternatives WHERE thing_id = :id;

-- name: create-alternative!
INSERT INTO alternatives (thing_id, name, text, price, chosen)
VALUES (:thingid, :name, :text, :price, :chosen);

-- name: update-alternative!
UPDATE alternatives
SET name=:name, text=:text, price=:price, chosen=:chosen
WHERE id = :id;

-- name: delete-alternative!
DELETE FROM alternatives WHERE id = :id;
