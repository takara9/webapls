def label = "mypod-${UUID.randomUUID().toString()}"
podTemplate(
  label: label,
  containers: [
    containerTemplate(name: 'dockerd', image: 'docker:dind', ttyEnabled: true, alwaysPullImage: true, privileged: true,
      command: 'dockerd --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375 --storage-driver=overlay'),
    containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl:latest', ttyEnabled: true, alwaysPullImage: true, privileged: true, command: 'cat' )
  ],
  volumes: [
    emptyDirVolume(memory: false, mountPath: '/var/lib/docker'),
    configMapVolume(mountPath: '/kubeconfig', configMapName: 'kubeconfig-iks1')
  ]
) 
{
  node (label) {
    withCredentials([
      usernamePassword(credentialsId: 'docker_id', usernameVariable: 'DOCKER_ID_USR', passwordVariable: 'DOCKER_ID_PSW')
    ]) {
      stage('pull') {
        container('dockerd') {
            git url: 'https://github.com/takara9/node-express-login'
	    stage 'setup'
	    sh 'docker login --username=$DOCKER_ID_USR --password=$DOCKER_ID_PSW'
	    stage 'confirm'
	    sh 'env'
	    sh 'ls -al'
            stage 'build'
            sh 'docker build -t maho/node-express-login:$BUILD_NUMBER .'
	    stage 'push'
	    sh 'docker push maho/node-express-login:$BUILD_NUMBER'
        }
      }
      stage('confirm') {
        container('dockerd') {
            stage 'view'
            sh 'docker images'
        }
      }
      stage('deploy') {
          container('kubectl') {
            stage 'version'
	    sh 'kubectl version'
            stage 'get-cluster'
	    sh 'KUBECONFIG=/kubeconfig/kube-config-tok05-iks1.yml kubectl get node'
	    stage 'stage-status'
            sh 'ls -al'
	    stage 'setup yaml'
	    sh 'cat k8s-deployment.yaml.tmpl |sed s/\'XXXXX\'/$BUILD_NUMBER/ > k8s-deployment-j.yaml'
            stage 'deploy'
	    sh 'KUBECONFIG=/kubeconfig/kube-config-tok05-iks1.yml kubectl apply -f k8s-deployment-j.yaml'
	    sh 'KUBECONFIG=/kubeconfig/kube-config-tok05-iks1.yml kubectl apply -f k8s-service.yaml'	    	    
            stage 'expose'
	    sh 'KUBECONFIG=/kubeconfig/kube-config-tok05-iks1.yml kubectl apply -f k8s-ingress.yaml'
	    
          }
      }
    }
  }
}

