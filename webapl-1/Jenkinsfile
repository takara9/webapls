pipeline {

  environment {
    registry = "harbor.labo.local/k8s/webapl-1"
    dockerImage = ""
  }

  agent any
  stages {
    stage("環境確認") {
      steps {
              sh 'ls -al'
              sh 'env'
	      sh 'pwd'
      }
    }

    stage('コンテナイメージのビルド') {
      steps {
        script {
          dockerImage = docker.build registry + ":$BUILD_NUMBER"
        }
      }
    }
      
    stage('コンテナレジストリへプッシュ') {
      steps {
        script {
          docker.withRegistry("https://harbor.labo.local","harbor-login") {
            dockerImage.push()
          }
        }
      }
    }

    stage('K8sクラスタへのデプロイ') {
      steps {    
        withKubeConfig([credentialsId: 'k8s1-test']) {
	  sh 'env'
          sh 'kubectl cluster-info'
          sh 'sed s/__BUILDNUMBER__/$BUILD_NUMBER/ webapl1.yaml > webapl1-build.yaml'
          sh 'kubectl apply -f webapl1-build.yaml'
          sh 'kubectl get all'
	  sh 'kubectl get svc'
        }
      }
    }
  }
}

