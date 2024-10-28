package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

var ws = websocket.Upgrader{
	CheckOrigin: CheckOrigin,
}

func CheckOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	log.Print(origin)

	return strings.Contains(origin, "localhost")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", wsHandler)
	log.Fatal(http.ListenAndServe(":8080", mux))

}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := ws.Upgrade(w, r, nil)

	if err != nil {
		log.Fatal(err)

	}

	for {

		mType, p, err := conn.ReadMessage()

		if err != nil {
			log.Print(err)
		}

		log.Println("Handling conn:", conn.LocalAddr().String())

		if err := conn.WriteMessage(mType, p); err != nil {
			log.Println(err)
			return
		}

	}

}
