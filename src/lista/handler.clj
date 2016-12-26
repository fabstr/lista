(ns lista.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults api-defaults]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-params]]
            [ring.util.response :as response]
            [ring.middleware.keyword-params :refer [wrap-keyword-params]]
            [lista.app :as app]))

(defn list-things []
  (response/header (response/response (app/list-all-things))
                   "Access-Control-Allow-Origin" "*"))
       
(defn options-thing []
  (response/header (response/response "")
                   "Allow" "GET PUT"))

(defn update-thing [request & args]
  (let [params (:params request)]
    (response/response (app/update-thing params))))
    
(defroutes app-routes
  (GET "/thing"
       [] (list-things))

  (OPTIONS "/thing/:id"
           [id] (options-thing))

  (PUT "/thing/:id"
       [id] update-thing)

  (route/resources "/" {:root "build"})
  
  (route/not-found "Not Found"))

(def app
  (-> app-routes
      wrap-json-response
      wrap-keyword-params
      wrap-json-params
      (wrap-defaults api-defaults)))
