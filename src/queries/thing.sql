-- name: select-thing
SELECT * FROM things WHERE id = :id;

-- name: select-thing-by-values
SELECT * FROM things WHERE name=:name AND category=:category;

-- name: select-all-things
SELECT * FROM things;

-- name: create-thing!
INSERT INTO things (name, category) VALUES (:name, :category);

-- name: update-thing!
UPDATE things
SET name=:name, category=:category
WHERE id = :id;

-- name: delete-thing!
DELETE FROM things WHERE id = :id;
