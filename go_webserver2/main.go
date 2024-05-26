package main

import (
	"net/http"
	"os"
	"time"
	"github.com/takara9/go_util"
)


func main() {
	go_util.OpenLog("logfile.txt")
	go_util.LoadConfig("config.json")

	mux := http.NewServeMux()
        files := http.FileServer(http.Dir(go_util.Config.Static))
        mux.Handle("/", http.StripPrefix("/", files))

	port := os.Getenv("PORT")
	if port == "" {
		port = go_util.Config.TcpPort
	}

        server := &http.Server{
                Addr:           go_util.Config.IpAddress + ":" + port,
                Handler:        mux,
                ReadTimeout:    time.Duration(go_util.Config.ReadTimeout * int64(time.Second)),
                WriteTimeout:   time.Duration(go_util.Config.WriteTimeout * int64(time.Second)),
                MaxHeaderBytes: 1 << 20,
        }
 
	server.ListenAndServe()
}
