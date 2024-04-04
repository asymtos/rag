package main

import (
	"bytes"
	"crypto/tls"
	"crypto/x509"
	"fmt"

	//"github.com/lf-edge/eden/pkg/utils"
	"io/ioutil"
	"net/http"
	"time"

	log "github.com/sirupsen/logrus"
)

// http client with correct config
func (asymtos *AsymtosConfig) getHTTPClient() *http.Client {
	tlsConfig := &tls.Config{}
	if asymtos.serverCA != "" {
		caCert, err := ioutil.ReadFile(asymtos.serverCA)
		if err != nil {
			log.Fatalf("unable to read server CA file at %s: %v", asymtos.serverCA, err)
		}
		caCertPool := x509.NewCertPool()
		caCertPool.AppendCertsFromPEM(caCert)
		tlsConfig.RootCAs = caCertPool
	}
	if asymtos.insecureTLS {
		tlsConfig.InsecureSkipVerify = true
	}
	var client = &http.Client{
		Timeout: time.Second * 10,
		Transport: &http.Transport{
			TLSClientConfig:       tlsConfig,
			TLSHandshakeTimeout:   10 * time.Second,
			ResponseHeaderTimeout: 10 * time.Second,
		},
	}
	return client
}

func (asymtos *AsymtosConfig) deleteObj(path string) (err error) {
	u := asymtos.ResolveURL(asymtos.url, path)
	log.Println(u)
	if err != nil {
		log.Printf("error constructing URL: %v", err)
		return err
	}
	client := asymtos.getHTTPClient()
	req, err := http.NewRequest("DELETE", u, nil)
	if err != nil {
		log.Fatalf("unable to create new http request: %v", err)
	}

	response, err := asymtos.RepeatableAttempt(client, req)
	if err != nil {
		log.Fatalf("unable to send request: %v", err)
	}
	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("status code: %d", response.StatusCode)
	}
	return nil
}

func (asymtos *AsymtosConfig) getObj(path string, acceptMime string) (out string, err error) {
	u := asymtos.ResolveURL(asymtos.url, path)
	if err != nil {
		log.Printf("error constructing URL: %v", err)
		return "", err
	}
	client := asymtos.getHTTPClient()
	req, err := http.NewRequest("GET", u, nil)
	if err != nil {
		log.Fatalf("unable to create new http request: %v", err)
	}
	if acceptMime != "" {
		req.Header.Set("Accept", acceptMime)
	}

	response, err := asymtos.RepeatableAttempt(client, req)
	if err != nil {
		log.Fatalf("unable to send request: %v", err)
	}
	buf, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Printf("unable to read data from URL %s: %v", u, err)
		return "", err
	}
	return string(buf), nil
}

func (asymtos *AsymtosConfig) getList(path string, acceptMime string) (response *http.Response, err error) {
	u := asymtos.ResolveURL(asymtos.url, path)
	if err != nil {
		log.Printf("error constructing URL: %v", err)
		return nil, err
	}
	client := asymtos.getHTTPClient()
	req, err := http.NewRequest("GET", u, nil)
	if err != nil {
		log.Fatalf("unable to create new http request: %v", err)
	}
	if acceptMime != "" {
		req.Header.Set("Accept", acceptMime)
	}

	response, err = asymtos.RepeatableAttempt(client, req)
	if err != nil {
		log.Fatalf("unable to send request: %v", err)
	}
	// buf, err := ioutil.ReadAll(response.Body)
	// if err != nil {
	// 	log.Printf("unable to read data from URL %s: %v", u, err)
	// 	return nil, err
	// }
	return response, nil
}

func (asymtos *AsymtosConfig) postObj(path string, obj []byte, mimeType string) (err error) {
	u := asymtos.ResolveURL(asymtos.url, path)
	if err != nil {
		log.Printf("error constructing URL: %v", err)
		return err
	}
	client := asymtos.getHTTPClient()
	req, err := http.NewRequest("POST", u, bytes.NewBuffer(obj))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", mimeType)

	_, err = asymtos.RepeatableAttempt(client, req)
	if err != nil {
		return err
	}
	return nil
}

func (asymtos *AsymtosConfig) putObj(path string, obj []byte, mimeType string) (err error) {
	u := asymtos.ResolveURL(asymtos.url, path)
	if err != nil {
		log.Printf("error constructing URL: %v", err)
		return err
	}
	client := asymtos.getHTTPClient()
	req, err := http.NewRequest("PUT", u, bytes.NewBuffer(obj))
	if err != nil {
		log.Fatalf("unable to create new http request: %v", err)
	}
	req.Header.Set("Content-Type", mimeType)
	_, err = asymtos.RepeatableAttempt(client, req)
	if err != nil {
		log.Fatalf("unable to send request: %v", err)
	}
	return nil
}
