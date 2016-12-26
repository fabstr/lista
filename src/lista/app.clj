(ns lista.app
  (:require [yesql.core :as yesql]
            [lista.db :as db]
            [lista.core :as core]))

(defn parse-int [s]
   (Integer. (re-find  #"\d+" s )))

(defn list-all-things []
  (let [all-things (db/select-all-things)
        all-alternatives (db/select-alternatives-by-things {:thingids (map :id all-things)})]
    (map (fn [thing]
           (core/make-thing (:id thing)
                            (:name thing)
                            (:category thing)
                            (filter (fn [alternative]
                                      (= (:thing_id alternative)
                                         (:id thing)))
                                    all-alternatives)))
         all-things)))

(defn dispatch-alternative-update [alternative alternatives-in-db thing-id]
  (if (not-any? (fn [alternative-in-db]
                  (= (:id alternative)
                     (:id alternative-in-db)))
                alternatives-in-db)
    ;; new alternative
    (db/create-alternative! {:thingid thing-id
                             :name (:name alternative)
                             :text (:text alternative)
                             :price (:price alternative)
                             :chosen (:chosen alternative)})
    
    ;; existing alternative
    (db/update-alternative! {:id (:id alternative)
                             :name (:name alternative)
                             :text (:text alternative)
                             :price (:price alternative)
                             :chosen (:chosen alternative)})))
  
(defn update-thing [thing]
  (let [thing-id (parse-int (:id thing))
        alternatives-in-db (db/select-alternatives-by-thing {:id thing-id})]

    ;; add or update alternatives
    (map (fn [alternative]
           (dispatch-alternative-update alternative alternatives-in-db thing-id))
         (:alternatives thing))

    ;; should any alternatives be removed?
    (map (fn [alternative-to-remove]
           (db/delete-alternative! {:id (:id alternative-to-remove)}))
         (filter (fn [alternative-in-db]
                   (not-any? (fn [alternative]
                               (= (:id alternative)
                                  (:id alternative-in-db)))
                             (:alternatives thing)))
                 alternatives-in-db))))
