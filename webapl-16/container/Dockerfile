FROM nginx:1.25

# /etc/passwd に以下のエントリーが存在することを前提に設定
# nginx:x:101:101:nginx user,,,:/nonexistent:/bin/false

# nginxで動作するように変更、特権ポート80 から、 一般ポート8080へ
COPY default.conf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx

# 目標となるように、コンテンツの表示を変更
COPY html /usr/share/nginx/html 

# nginx で操作するプロセスがアクセスできるようにする
RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /usr/share/nginx && \
  chown -R nginx:nginx /etc/nginx

USER nginx

CMD ["nginx"]
