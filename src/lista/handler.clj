(ns lista.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [yesql.core :as yesql]
            [clojure.test :only [is] :as test]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.util.response :refer [response]]))

(defn
  ^{:test (fn []
            (test/is (= (make-alternative "url" 123)
                        {:url "url" :price 123 :chosen false})))}
  make-alternative [url price]
  {:url url :price price :chosen false})

(defn
  ^{:test (fn []
            (test/is (= (make-thing "thing" "category")
                        {:name "thing" :category "category" :alternatives {}}))
            (test/is (= (make-thing "thing" "category"
                                    "url1" "alt1"
                                    "url2" "alt2")
                        {:name "thing" :category "category"
                         :alternatives {"url1" "alt1",
                                        "url2" "alt2"}})))}
  make-thing [name category & alternative-kvs]
  (let [alternatives (if (empty? alternative-kvs)
                       {}
                       (apply assoc {} alternative-kvs))]
    {:name name
     :category category
     :alternatives alternatives}))

(defn
  ^{:test (fn []
            (test/is (= (add-alternative {:alternatives {}}
                                         {:url "url" :price 1})
                        {:alternatives {"url" {:url "url" :price 1}}}))
            (test/is (= (add-alternative {:alternatives {"url1" {:url "url1" :price 1}
                                                         "url2" {:url "url2" :price 2}}}
                                         {:url "url2" :price 2}))))}
  add-alternative [thing alternative]
  (let [old-alternatives (:alternatives thing)
        new-alternatives (assoc old-alternatives
                                (:url alternative)
                                alternative)]
    (assoc thing :alternatives new-alternatives)))

(defn
  ^{:test (fn []
            (test/is (= (update-alternative
                         {:alternatives {"url1" {:url "url1" :price 2 :chosen false}}}
                         "url1" :price 1)
                        {:alternatives {"url1" {:url "url1" :price 1 :chosen false}}}))

            (test/is (= (update-alternative
                         {:alternatives {"url1" {:url "url1" :price 2 :chosen false}}}
                         "url1" :price 1 :chosen true)
                        {:alternatives {"url1" {:url "url1" :price 1 :chosen true}}})))}
  update-alternative [thing url & kvs]
  (let [alternative (get (:alternatives thing)
                         url)
        new-alternative (apply assoc alternative kvs)]
    (assoc thing :alternatives (assoc (:alternatives thing)
                                      url new-alternative))))

(def things
  [
   (make-thing "sak 1" "kategori 1"
               "https://example.com/1_1" {:url "https://example.com/1_1" :price 1 :chosen false}
               "https://example.com/1_2" {:url "https://example.com/1_2" :price 2 :chosen false}
               "https://example.com/1_3" {:url "https://example.com/1_3" :price 3 :chosen false})
   (make-thing "sak 2" "kategori 2"
               "https://example.com/2_1" {:url "https://example.com/2_1" :price 1 :chosen false}
               "https://example.com/2_2" {:url "https://example.com/2_2" :price 2 :chosen false}
               "https://example.com/2_3" {:url "https://example.com/2_3" :price 3 :chosen false})
   (make-thing "sak 3" "kategori 3"
               "https://example.com/3_1" {:url "https://example.com/3_1" :price 1 :chosen false}
               "https://example.com/3_2" {:url "https://example.com/3_2" :price 2 :chosen false}
               "https://example.com/3_3" {:url "https://example.com/3_3" :price 3 :chosen false})])

(defn thing-index []
  (ring.util.response/response things))

(defroutes app-routes
  (GET "/" [] "Helloasdads World")
  (GET "/thing" [] (thing-index))
  (route/not-found "Not Found"))

(def app
  (-> app-routes
      (wrap-json-response)
      (wrap-defaults site-defaults)))
