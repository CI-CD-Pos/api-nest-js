FROM jenkins/jenkins:lts

USER root

# ========================================
# Ferramentas do sistema: Docker, Make, Trivy, Git, etc.
# ========================================
RUN apt-get update \
 && apt-get install -y \
    docker.io make build-essential wget ca-certificates curl git unzip \
 && apt-get clean

# ========================================
# Trivy (scanner de vulnerabilidades)
# ========================================
RUN wget -qO /tmp/trivy.tar.gz \
    https://github.com/aquasecurity/trivy/releases/download/v0.68.2/trivy_0.68.2_Linux-64bit.tar.gz \
 && tar -xzf /tmp/trivy.tar.gz -C /usr/local/bin trivy \
 && rm -f /tmp/trivy.tar.gz

# ========================================
# Node.js 22 + pnpm
# ========================================
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm@latest && \
    node --version && pnpm --version

# ========================================
# SonarQube Scanner CLI
# ========================================
ENV SONAR_SCANNER_VERSION=6.2.1.4610
ENV SONAR_SCANNER_HOME=/opt/sonar-scanner
ENV PATH=${SONAR_SCANNER_HOME}/bin:${PATH}

RUN wget -qO /tmp/sonar-scanner.zip \
    https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip \
 && unzip /tmp/sonar-scanner.zip -d /opt \
 && mv /opt/sonar-scanner-${SONAR_SCANNER_VERSION}-linux-x64 ${SONAR_SCANNER_HOME} \
 && rm /tmp/sonar-scanner.zip

USER jenkins