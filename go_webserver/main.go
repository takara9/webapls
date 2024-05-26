package main

import (
	"os"
	"fmt"
	"net/http"
	"github.com/takara9/go_util"
)

func handler(writer http.ResponseWriter, request *http.Request) {
	fmt.Fprintf(writer, "Hello World, %s!\n", request.URL.Path[1:])
	go_util.Logger.Printf("Hello World, %s!\n", request.URL.Path[1:])
}

func main() {
	go_util.OpenLog("logfile.txt")
	go_util.LoadConfig("config.json")

	port := ":" + os.Getenv("PORT")
	if port == ":" {
		port = go_util.Config.TcpPort
	}

	http.HandleFunc("/", handler)
	http.ListenAndServe(port, nil)
}
