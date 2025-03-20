#!/bin/bash
apt-get update && apt-get upgrade -y
apt-get install -y mc net-tools curl ca-certificates


# docker-compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose


# node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
npm install -g npm
npm install -g nest-cli
npm install -g pnpm


# run
# docker-compose -f /workspaces/example-0-nest/docker-compose-dev.yml up -d