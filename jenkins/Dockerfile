FROM jenkins/jenkins:lts

USER root
RUN apt-get update \
 && apt-get install -y docker.io make build-essential wget ca-certificates curl \
    git \
 && curl -fsSL -o /usr/local/bin/kubectl https://dl.k8s.io/release/v1.29.3/bin/linux/amd64/kubectl \
 && chmod +x /usr/local/bin/kubectl \
 && wget -qO /tmp/trivy.tar.gz https://github.com/aquasecurity/trivy/releases/download/v0.68.2/trivy_0.68.2_Linux-64bit.tar.gz \
 && tar -xzf /tmp/trivy.tar.gz -C /usr/local/bin trivy \
 && rm -f /tmp/trivy.tar.gz \
 && apt-get clean

ENV NVM_DIR=/opt/nvm
ENV PATH=${NVM_DIR}/versions/node/v22.13.1/bin:${PATH}

RUN mkdir -p ${NVM_DIR} && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    . ${NVM_DIR}/nvm.sh && \
    nvm install 22.13.1 && \
    nvm alias default 22.13.1 && \
    npm install -g npm@latest

USER jenkins