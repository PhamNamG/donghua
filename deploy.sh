#!/bin/bash
APP_DIR="/home/ubuntu/donghua"
APP_NAME="donghua"

echo ">>> Pull latest code"
cd $APP_DIR
git fetch origin main
git reset --hard origin/main

echo ">>> Update env (nếu cần)"
# Coi như đã chỉnh .env.local

echo ">>> Build only if code/env thay đổi"
npm install
npm run build

echo ">>> Restart PM2"
pm2 restart $APP_NAME || pm2 start ecosystem.config.js

echo ">>> Done!"
pm2 status $APP_NAME
