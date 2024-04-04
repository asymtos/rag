package main

import (
	"fmt"
	"log"
	"net/http"
)

const webPort = "8082"

type AsymtosConfig struct {
	url         string
	serverCA    string
	insecureTLS bool
}

func main() {

	app := AsymtosConfig{

		url:         "https://localhost:9095",
		insecureTLS: false,
		serverCA:    "./certificates/server.pem",
	}
	log.Printf("Starting broker service on port %s\n", webPort)

	// define http server

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", webPort),
		Handler: app.routes(),
	}

	// start the server
	err := srv.ListenAndServe()
	if err != nil {

		log.Panic(err, err)
	}

}
