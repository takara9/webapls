<?php

Class Cfenv
{
    public $user;
    public $pass;
    public $host;
    public $port;
    public $ca;
    public $ca_pem_filename;
    public $label;
    public $dbname;
    public $vcap_service;
    public $uri;
    
    // Constructor
    function __construct() {
        if (isset($_ENV["VCAP_SERVICES"])) {
            $this->vcap_services = json_decode($_ENV["VCAP_SERVICES"]);
        } else {
            $this->vcap_services = json_decode(file_get_contents("vcap-local.json"))->{'VCAP_SERVICES'};
        }
    }

    public function byInstName($inst_name) {
        foreach($this->vcap_services as $key => $value) {
            $array = $this->vcap_services->{$key};
            foreach($array as $idx => $value) {
                if ($inst_name == $array[$idx]->name) {
                    $this->parse_by_service($array[$idx],$idx);
                }
            }
        }
    }

    public function byServiceName($svc_name) {
        foreach($this->vcap_services as $key => $value) {
            if ($key == $svc_name) {
                $array = $this->vcap_services->{$key};
                $idx = 0;
                $this->parse_by_service($array[$idx],$idx);
            }
        }
    }
        
    function parse_by_service($inst,$idx) {
        $this->label = $inst->label;
        switch ($this->label) {
        case 'cleardb':
            $this->parser_cleardb($inst->credentials);
            break;
        case 'dashDB':
            $this->parser_dashdb($inst->credentials);
            break;
        case 'compose-for-mysql':
            $this->ca_pem_filename = $this->label."_".$idx.".pem";
            $this->parser_compose_for_mysql($inst->credentials);
            break;
        case 'compose-for-postgresql':
            $this->ca_pem_filename = $this->label."_".$idx.".pem";
            $this->parser_compose_for_postgressql($inst->credentials);
            break;
        case 'user-provided':
	    $this->user = $inst->credentials->username;
            $this->pass = $inst->credentials->password;
            $this->uri  = $inst->credentials->uri;	
            break;
        default:
            echo "ERROR\n";
        }
    }

    // dashDB (Db2)
    function parser_dashdb($vcap) {
        $this->host   = $vcap->hostname;
        $this->port   = $vcap->port;
        $this->ca     = null;
        $this->user   = $vcap->username;
        $this->pass   = $vcap->password;
        $this->dbname = $vcap->db;
    }
        
    // ClearDB (MySQL)
    function parser_cleardb($vcap) {
        $this->host   = $vcap->hostname;
        $this->port   = $vcap->port;
        $this->ca     = null;
        $this->user   = $vcap->username;
        $this->pass   = $vcap->password;
        $this->dbname = $vcap->name;
    }

    // Compose for MySQL
    function parser_compose_for_mysql($vcap) {
        $uri = $vcap->uri; 
        $s1 = preg_replace('/mysql:\/\//',null,$uri);
        $sa = preg_split('/:/',$s1);
        $this->user = $sa[0];
        $this->pass = preg_split('/@/',$sa[1])[0];
        $this->host = preg_split('/@/',$sa[1])[1];
        $this->port = preg_split('/\//',$sa[2])[0];
        $this->ca = base64_decode($vcap->ca_certificate_base64);
        file_put_contents($this->ca_pem_filename,$this->ca);
    }


    // Compose for PostgreSQL
    function parser_compose_for_postgressql($vcap) {
        $uri = $vcap->uri;
        $s1 = preg_replace('/postgres:\/\//',null,$uri);
        $sa = preg_split('/:/',$s1);
        $this->user = $sa[0];
        $this->pass = preg_split('/@/',$sa[1])[0];
        $this->host = preg_split('/@/',$sa[1])[1];
        $this->port = preg_split('/\//',$sa[2])[0];
        $this->dbname = preg_split('/\//',$sa[2])[1];
        $this->ca = base64_decode($vcap->ca_certificate_base64);
        file_put_contents($this->ca_pem_filename,$this->ca);
    }
}                        
?>