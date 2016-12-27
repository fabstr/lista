(ns lista.core
  (:require [clojure.test :only [is] :as test]))

(defn
  ^{:test (fn []
            (test/is (= (make-alternative "id" "name" "text" 123)
                        {:id "id" :name "name" :text "text" :price 123 :chosen false}))
            (test/is (= (make-alternative "id" "name" "text" 123 true)
                        {:id "id" :name "name" :text "text" :price 123 :chosen true})))}
  make-alternative
  ([id name text price]
   (make-alternative id name text price false))
  ([id name text price chosen]
   {:id id :name name :text text :price price :chosen chosen}))

(defn
  ^{:test (fn []
            (test/is (= (make-thing "id" "thing" "category")
                        {:id "id" :name "thing" :category "category" :alternatives #{}}))
            (test/is (= (make-thing "id" "thing" "category"
                                    "alternative1"
                                    "alternative2")
                        {:id "id" :name "thing" :category "category"
                         :alternatives #{"alternative1" "alternative2"}})))}
  make-thing [id name category alternatives]
    {:id id
     :name name
     :category category
     :alternatives (set alternatives)})

(defn
  ^{:test (fn []
            (test/is (= (add-alternative {:alternatives #{}}
                                         {:id "id1" :url "url" :price 1})
                        {:alternatives #{{:id "id1" :url "url" :price 1}}}))
            (test/is (= (add-alternative {:alternatives #{{:id "id1" :url "url1" :price 1}}}
                                         {:id "id2" :url "url2" :price 2})
                        {:alternatives #{{:id "id1" :url "url1" :price 1}
                                         {:id "id2" :url "url2" :price 2}}})))}
  add-alternative [thing alternative]
  (assoc thing :alternatives (conj (:alternatives thing)
                                   alternative)))

(defn
  ^{:test (fn []
            (test/is (= (update-alternative
                         {:alternatives #{{:id "id"
                                           :name "name"
                                           :text "text"
                                           :price 2
                                           :chosen false}}}
                         "id"
                         :name "name2")
                        {:alternatives #{{:id "id"
                                          :name "name2"
                                          :text "text"
                                          :price 2
                                          :chosen false}}})))}
  update-alternative [thing alternative-id & kvs]
  (assoc thing :alternatives (set (map (fn [alternative]
                                         (if (= alternative-id (:id alternative))
                                           (apply assoc alternative kvs)
                                           alternative))
                                       (:alternatives thing)))))

(defn ^{:test (fn []
                (test/is (= (remove-alternative
                             {:alternatives #{{:id "id1"}
                                              {:id "id2"}}}
                             "id2")
                            {:alternatives #{{:id "id1"}}})))}
  remove-alternative [thing alternative-id]
  (assoc thing :alternatives (set (filter (fn [alternative]
                                            (not (= alternative-id
                                                    (:id alternative))))
                                          (:alternatives thing)))))
