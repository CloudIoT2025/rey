#!/bin/bash
# 시스템 패키지 설치
sudo yum update -y
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git mariadb105-server

# Node 의존성 설치
npm install

# MySQL 시작 및 초기화
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql < init.sql

# 서버 실행
node app.js
