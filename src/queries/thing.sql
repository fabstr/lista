-- name: select-thing
SELECT * FROM things WHERE id = ?;

-- name: select-all-things
SELECT * FROM things;

-- name: create-thing!
INSERT INTO things (name, category) VALUES (?, ?);

-- name: update-thing!
UPDATE things
SET name=?, category=?
WHERE id = ?;

-- name: delete-thing!
DELETE FROM things WHERE id = ?;
