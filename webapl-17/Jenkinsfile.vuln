pipeline {
  agent any
  environment {
    reg_server   = "harbor.labo.local"
    repository   = "k8s/webapl-17"
    container    = "${ reg_server }/${ repository }" + ":$BUILD_NUMBER"
    registry_url = "https://${ reg_server }"
    auth_regi    = "harbor-login"
    auth_k8s     = "k8s4-test"
  }

  tools {
      maven 'mvn-3.8.5'
  }

  stages {

    stage ('ソースコードのテスト') {
      steps {
        sh 'mvn -Dmaven.test.failure.ignore=true test' 
      }
      post {
        success {
           junit 'target/surefire-reports/**/*.xml' 
        }}}


    stage('コンテナのビルド') {
      steps {
        script {
          dockerImage = docker.build container
        }}}


    stage('コンテナレジストリへプッシュ') {
      steps {
        script {
          docker.withRegistry(registry_url, auth_regi) {
            dockerImage.push()
          }}}}


    stage('コンテナの脆弱性検査とSBOM作成') {
      steps {
          script {
      	      withCredentials([string(credentialsId: "anchore-login", variable: 'ANCHORE_CLI_PASS')]) {
	         sh '''
                 export ANCHORE_CLI_URL=http://localhost:8228/v1
                 export ANCHORE_CLI_USER=admin
		 anchore-cli image add  $container
                 anchore-cli image wait $container
                 anchore-cli image vuln $container all
		 #anchore-cli evaluate check $container --detail
                 #anchore-cli image content $container os
                 #anchore-cli image content $container npm
		 '''
		 }}}}




    stage('K8sクラスタへのデプロイ') {
      steps {    
        withKubeConfig([credentialsId: auth_k8s]) {
          sh '''	
          sed s/__TAG__/$BUILD_NUMBER/ k8s-yaml/_deployment.yaml > k8s-yaml/deployment.yaml
          kubectl apply -k k8s-yaml
          kubectl get all
	  kubectl get svc
          '''	  
        }}}}
  
  post {
      always {
          sh 'docker rmi $container'
	  sh 'docker system prune --all --force'
      }}

}


