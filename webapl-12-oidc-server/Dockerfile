FROM ubuntu:18.04
WORKDIR /app
RUN apt-get update && \
    apt-get install -y \
    apt-transport-https \
    python3 \
    python3-pip \
    emacs25-nox \
    git \
    curl \
    locales \
    libsasl2-dev \
    python-dev \
    libldap2-dev \
    libssl-dev


#
# Python モジュールのインストール
#
COPY requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

#
# 言語環境設定
#
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9

ENV PORT 5810
ENV FLASK_ENV=development
ENV TESTING=True

#
# アプリ
#
COPY public       /app/public
COPY templates    /app/templates
COPY app.py       /app/app.py
#COPY auth_config.py    /app/auth_config.py
#COPY key-private.pem  /app/key-private.pem
#COPY key-public.pem   /app/key-public.pem

EXPOSE 5810

CMD [ "python3", "/app/app.py" ]

