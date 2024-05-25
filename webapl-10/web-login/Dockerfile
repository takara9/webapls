FROM python:3
WORKDIR /

RUN apt-get update && \
    apt-get -y install locales

#
# 言語環境設定
#
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9

#
# Python モジュールのインストール
#
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

#
# アプリケーション
#
COPY /apl.py apl.py
COPY /templates templates

#
# 実行
#
EXPOSE 5000
CMD ["python", "/apl.py"]


