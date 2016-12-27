(ns lista.app
  (:require [yesql.core :as yesql]
            [lista.db :as db]
            [lista.core :as core]))

(defn parse-int [s]
   (Integer. (re-find  #"\d+" s )))


(defn make-thing-from-db [thing-from-db alternatives]
  (let [thing (if (list? thing-from-db)
                (first thing-from-db)
                thing-from-db)]
    (core/make-thing (:id thing)
                     (:name thing)
                     (:category thing)
                     alternatives)))

(defn make-alternative-from-db [alternative-from-db]
  (let [alternative (if (list? alternative-from-db)
                      (first alternative-from-db)
                      alternative-from-db)]
    (core/make-alternative (:id alternative)
                           (:name alternative)
                           (:text alternative)
                           (:price alternative)
                           (:chosen alternative))))

(defn list-all-things []
  (let [all-things (db/select-all-things)
        all-alternatives (map make-alternative-from-db
                              (db/select-alternatives-by-things {:thingids (map :id all-things)}))]
    (map (fn [thing]
           (make-thing-from-db thing
                               (filter (fn [alternative]
                                         (= (:thing_id alternative)
                                            (:id thing)))
                                       all-alternatives)))
         all-things)))

(defn select-thing [id]
  (let [thing (db/select-thing {:id (parse-int id)})
        alternatives (db/select-alternatives-by-thing {:id (parse-int id)})]
    (make-thing-from-db thing (map make-alternative-from-db alternatives))))

(defn create-thing! [thing]
  (do (db/create-thing! {:name (:name thing)
                         :category (:category thing)})
      (make-thing-from-db (db/select-thing-by-values {:name (:name thing)
                                                      :category (:category thing)})
                          [])))

(defn update-thing! [thing]
  (do (db/update-thing! {:id (parse-int (:id thing))
                         :name (:name thing)
                         :category (:category thing)})
      (select-thing (:id thing))))

(defn delete-thing! [thing-id]
  (db/delete-thing! {:id (parse-int thing-id)}))

(defn select-alternative [alternative-id]
  (make-alternative-from-db (db/select-alternative {:id (parse-int alternative-id)})))

