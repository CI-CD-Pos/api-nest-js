pipeline {
  agent any

  environment {
    IMAGE = "api-nest-js-ci:latest" // TODO: Colocar a tag conforme a env variable
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD'
      }
    }

    stage('Test Docker Access') {
      steps {
        sh 'id'
        sh 'echo "DOCKER_HOST=${DOCKER_HOST:-<unset>}"'
        sh 'ls -l /run/user/1000/docker.sock || true'
        sh 'docker version'
      }
    }

    stage('Build') {
      steps {
        sh 'make build'
      }
    }

    stage('Unit Tests') {
      steps {
        sh 'make test'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'make build-docker IMAGE=${IMAGE}'
      }
    }
  }

  post {
    always {
      sh 'docker images | head -n 20 || true'
    }
  }
}