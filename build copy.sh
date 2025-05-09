#!/bin/bash

#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载 nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd "$(dirname "${BASH_SOURCE[0]}")"


PULL_RESULT=$(git pull origin main 2>&1)
echo $PULL_RESULT

# 检查 git pull 的输出
if [[ $PULL_RESULT == *"Already up to date"* ]]; then
    exit 0
fi
 
if ! command -v pnpm &> /dev/null; then
    sudo npm install -g pnpm
fi

pnpm i || {
    echo "Error: Failed to install dependencies"
    exit 1
}
pnpm build || {
    echo "Error: Failed to build"
    exit 1
}

echo `git rev-parse HEAD` > dist/version.txt

scp -r ./dist b03-prod-nginx:/home/ubuntu
ssh b03-prod-nginx "sudo cp -r /home/ubuntu/dist/* /var/www/tg-bot/"
ssh b03-prod-nginx "rm -rf /home/ubuntu/dist"
