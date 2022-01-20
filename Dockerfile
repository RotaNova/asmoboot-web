#!/bin/bash
# 设置基础镜像 amd64/nginx for Mac
FROM nginx
# FROM amd64/nginx

#MAINTAINER
MAINTAINER linshancheng

# npm镜像，解决报错而引入
# RUN npm config set registry https://registry.npm.taobao.org
# RUN npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass
# 设置基础镜像
# RUN npm run build
# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY dist/  /usr/share/nginx/html/
# 用本地的 default.conf 配置来替换nginx镜像里的默认配置
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

RUN echo 'docker image success !'