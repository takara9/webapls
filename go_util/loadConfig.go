package go_util

/*
 Package log  https://golang.org/pkg/log/
 Package os   https://golang.org/pkg/os/
 Package encoding/json  https://golang.org/pkg/encoding/json/
*/
import (
        "os"
        "log"
        "encoding/json"
)

/*
  Global variable 
  グローバル変数
　　大文字から始まるものは、他パッケージからも参照可能
*/
var Config Configuration
var Logger *log.Logger

// 構造体
type Configuration struct {
	IpAddress    string
	TcpPort      string
	ReadTimeout  int64
	WriteTimeout int64
	Static       string
}


/*
　初期化関数　
　　mainがコールされる前に一回だけ呼び出される
*/
//func init() {
	//openLog()
	//loadConfig()
//}

/*
   ログ出力初期化
*/
func OpenLog(logFileName string) int {
	// OpenFile is the generalized open call; most users will use Open or Create instead
	file, err := os.OpenFile(logFileName, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		// Fatalln is equivalent to Println() followed by a call to os.Exit(1)
		log.Fatalln("Failed to open log file", err)
	}

	/*
	   New creates a new Logger. The out variable sets the destination to which log 
           data will be written. 
	   The prefix appears at the beginning of each generated log line. 
	   The flag argument defines the logging properties. 
        */
        Logger = log.New(file, "INFO ", log.Ldate|log.Ltime|log.Lshortfile)
	return(0)
}


/*
   設定ファイルの読み込み
*/
func LoadConfig(configFileName string) int {
	/* 
           Open opens the named file for reading. If successful, methods on the returned file 
           can be used for reading; the associated file descriptor has mode O_RDONLY. 
           If there is an error, it will be of type *PathError. 
        */
	file, err := os.Open(configFileName)
	if err != nil {
		// Fatalln is equivalent to Println() followed by a call to os.Exit(1)
		log.Fatalln("Cannot open config file", err)
	}
        decoder := json.NewDecoder(file)
	Config = Configuration{}
	err = decoder.Decode(&Config)
	if err != nil {
		// Fatalln is equivalent to Println() followed by a call to os.Exit(1)
		log.Fatalln("Cannot get configuration from file", err)
	}
	return(0)
}





