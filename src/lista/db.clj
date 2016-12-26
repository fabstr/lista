(ns lista.db
  (:require [yesql.core :as yesql]
            [lista.core :refer :all]))

(def db-spec {:classname "org.postgresql.Driver"
              :subprotocol "postgresql"
              :subname "//localhost:5432/lista"
              :user "lista"
              :password "secret"})

(yesql/defqueries "queries/createdb.sql" {:connection db-spec})
(yesql/defqueries "queries/thing.sql" {:connection db-spec})
(yesql/defqueries "queries/alternative.sql" {:connection db-spec})

(defn reset-database! []
  (do (drop-alternatives-table!)
      (drop-things-table!)
      (create-things-table!)
      (create-alternatives-table!)
      (seed-things!)
      (seed-alternatives!)))
