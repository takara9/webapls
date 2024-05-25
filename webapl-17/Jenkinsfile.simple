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
        }
      }
    }


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
          sh 'docker system prune -a'	  
      }}

}


