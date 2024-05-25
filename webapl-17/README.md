# webapl-17


## はじめかた

~~~
$ cd k8s-yaml
$ kubectl secret -f secret.yaml
$ kubectl create configmap mysql-config --from-file=mysql.conf.d
$ cd ../src/main/resources
$ kubectl create configmap application.prop --from-file=application.properties
~~~



~~~
maho:webapl-17 maho$ tree -L 2
.
├── Dockerfile
├── Jenkinsfile.argocd
├── Jenkinsfile.simple
├── Jenkinsfile.vuln
├── README.md
├── k8s-yaml
│   ├── _deployment.yaml
│   ├── deployment.yaml
│   ├── job.yaml
│   ├── kustomization.yaml
│   ├── mysql-sts.yaml
│   ├── mysql.conf.d
│   ├── secret.yaml
│   └── service.yaml
├── mvnw
├── pom.xml
├── rest-test
│   ├── pom.xml
│   └── src
├── selenium-test
│   ├── pom.xml
│   └── src
└── src
    ├── main
    └── test

9 directories, 16 files
~~~