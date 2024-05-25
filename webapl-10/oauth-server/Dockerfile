FROM ubuntu:18.04
WORKDIR /
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
# なんだったけ？
#
RUN git clone https://github.com/fai555/Istio-and-JWT

#
# Python モジュールのインストール
#
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

#
# 言語環境設定
#
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9


COPY apl.py ./

CMD [ "python3", "./apl.py" ]
