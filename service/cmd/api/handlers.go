package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
)

const (
	mimeTextPlain       = "text/plain"
	mimeJSON            = "application/json"
	RootCertificatePath = "./certificates/server.pem"
)

type RequestPayload struct {
	Action string      `json:"action"`
	Auth   AuthPayload `json:"auth,omitempty"`
	User   UserPayLoad `json:"user,omitempty"`
}

type AuthPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserPayLoad struct {
	Email     string `json:"email"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Password  string `json:"password"`
}

func (app *AsymtosConfig) HandleSubmission(w http.ResponseWriter, r *http.Request) {
	var requestPayload RequestPayload

	err := app.readJSON(w, r, &requestPayload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	switch requestPayload.Action {
	case "auth":
		app.auth(w, requestPayload.Auth)
	case "creteuser":
		app.createUser(w, requestPayload.User)
	case "status":
		app.NodeStatus(w)
	default:
		app.errorJSON(w, errors.New("unknown action"))
	}
}

func (app *AsymtosConfig) createUser(w http.ResponseWriter, a UserPayLoad) {

	jsonData, _ := json.MarshalIndent(a, "", "\t")
	err := app.postObj("user", jsonData, mimeJSON)
	if err != nil {
		log.Fatal(err)
	}
	var payload jsonResponse
	payload.Error = false
	payload.Message = "New User added successfully!"
	//payload.Data = data
	app.writeJSON(w, http.StatusAccepted, payload)

}

func (app *AsymtosConfig) auth(w http.ResponseWriter, a AuthPayload) {

	jsonData, _ := json.MarshalIndent(a, "", "\t")

	err := app.postObj("authenticate", jsonData, mimeJSON)
	fmt.Println("a ...any")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	var payload jsonResponse
	payload.Error = false
	payload.Message = "Authenticated!"
	//payload.Data = data
	app.writeJSON(w, http.StatusAccepted, payload)

}

func (app *AsymtosConfig) NodeStatus(w http.ResponseWriter) {

	response, err := app.getList("api/v1/brands/status", mimeJSON)
	if err != nil {
		log.Fatal(err)
	}

	var jsonFromService jsonResponse
	err = json.NewDecoder(response.Body).Decode(&jsonFromService)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if jsonFromService.Error {
		app.errorJSON(w, err, http.StatusUnauthorized)
		return
	}

	var payload jsonResponse
	payload.Error = false
	payload.Message = "Success!"
	payload.Data = jsonFromService.Data

	app.writeJSON(w, http.StatusAccepted, payload)

}
