package go_util

import "testing"

func TestCase001(t *testing.T) {


	ret := 0
	logFn := "_test_logfile.txt"
	ret = OpenLog(logFn)
	if (ret != 0) {
		t.Errorf("openLog(%s)",logFn)
	}
	Logger.Print("Open log")



	cnfFn := "_test_config.json"
	Logger.Print("Load _test_config.json")
	ret = LoadConfig(cnfFn)

	if (ret != 0 ) {
		t.Errorf("loadConfig(%s)",cnfFn)
	}

	if (Config.IpAddress != "0.0.0.0") {
		t.Errorf("Config.IpAddress(%s)",Config.IpAddress)
	}

	if (Config.TcpPort != "8080") {
		t.Errorf("Config.TcpPort(%s)",Config.TcpPort)
	}

	Logger.Print("END OF TEST")
}

