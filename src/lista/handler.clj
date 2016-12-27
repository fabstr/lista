(ns lista.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults api-defaults]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-params]]
            [ring.util.response :as response]
            [ring.middleware.keyword-params :refer [wrap-keyword-params]]
            [lista.app :as app]))

(defn list-things [request]
  (response/header (response/response (app/list-all-things))
                   "Access-Control-Allow-Origin" "*"))
       
(defn options-thing [request]
  (response/header (response/response "")
                   "Allow" "GET POST PATCH DELETE"))

(defn select-thing [request]
  (response/response (app/select-thing (:id (:params request)))))

(defn create-thing! [request]
  (response/response (app/create-thing! (:params request))))

(defn update-thing! [request]
  (response/response (app/update-thing! (:params request))))

(defn delete-thing! [request]
  (response/response (app/delete-thing! (:id (:params request)))))

(defn select-alternative [request]
  (response/response (app/select-alternative (get-in request [:params :alternative-id]))))

(defn create-alternative! [request]
  (response/response (app/create-alternative! (get-in request [:params :thing-id])
                                              (:params request))))

(defn update-alternative! [request]
  (response/response (app/update-alternative! (:params request))))

(defn delete-alternative! [request]
  (response/response (app/delete-alternative! (get-in request [:params :alternative-id]))))



(defroutes app-routes
  (OPTIONS "/thing/:id"
           [id] options-thing)
  
  (GET "/thing"
       [] list-things)
  
  (POST "/thing"
        [] create-thing!)

  (GET "/thing/:id"
       [id] select-thing)

  (PATCH "/thing/:id"
         [id] update-thing!)

  (DELETE "/thing/:id"
          [id] delete-thing!)

  (OPTIONS "/thing/:thing-id/alternative/:alternative-id"
           [thing-id alternative-id] options-alternative)

  (GET "/thing/:thid-id/alternative/:alternative-id"
       [thing-id alternative-id] select-alternative)

  (POST "/thing/:thid-id/alternative/:alternative-id"
        [thing-id alternative-id] create-alternative!)

  (PATCH "/thing/:thid-id/alternative/:alternative-id"
         [thing-id alternative-id] update-alternative!)

  (DELETE "/thing/:thid-id/alternative/:alternative-id"
          [thing-id alternative-id] delete-alternative!)
  
  (route/resources "/" {:root "build"})
  
  (route/not-found "Not Found"))

(def app
  (-> app-routes
      wrap-json-response
      wrap-keyword-params
      wrap-json-params
      (wrap-defaults api-defaults)))
