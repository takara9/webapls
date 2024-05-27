# usertool
SoftLayer child user add, delete, list tool for the Hack session

#SOFTLAYERの子ユーザー作成ツール

　
##python コード

- x1_add_user.py   子ユーザー追加
- x2_list_user.py  子ユーザーリスト表示  
- x3_del_user.py   子ユーザー削除

  
##機能

このプログラムは、ソフトレイヤーのハンズオン研修用などの目的で、同じ権限の子ユーザーIDを一度に複数作るためのプログラムです。子ユーザーの作成条件は、下記の使い方に表した様に、このプログラムを編集して設定する方式のエッセンシャルな機能だけを持つものです。


##インストール方法

SoftLayerの仮想サーバーにインストールして利用と、手元のパソコンにインストールして利用のどちらでも、対応できます。


### CentOS6 x86_64 の場合

CentOS6では、InsecurePlatformWarningのワーニングが表示されるので、pip install requests==2.5.3 を実行してバージョンを下げることで対応します。

    yum update -y
    python --version
    Python 2.6.6
    rpm -ivh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
    yum install -y git
    yum install -y python-pip
    pip install softlayer
    pip install requests==2.5.3
    git clone https://github.com/takara9/usertool.git
    cd usertool
    ls
    README.md  x1_add_user.py  x2_list_user.py  x3_del_user.py

この後、それぞれのファイルのusername,api-keyを変更して実行します。
CentOS7 x86_64の場合は、rpm -iUvh http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-5.noarch.rpm  に置き換えます。


### Ubuntu 14.04 x86_64 の場合

    apt-get update
    apt-get upgrade -y
    python --version
    Python 2.7.6
    apt-get install python-pip -y
    pip install softlayer
    apt-get install git -y
    git clone https://github.com/takara9/usertool.git
    ls
    README.md  x1_add_user.py  x2_list_user.py  x3_del_user.py

この後、それぞれのファイルのusername,api-keyを変更して実行します。


### MacOS 10.9 の場合

最初からPythonが入っているので、pipのインストールから始めます。

    sudo -s
    easy_install pip
    pip install softlayer
    pip install requests==2.5.3
    exit
    git clone https://github.com/takara9/usertool.git
    ls
    README.md  x1_add_user.py  x2_list_user.py  x3_del_user.py

この後は同じです。 Ubuntuの場合と同じです。


### Windows 8.1 / Windows 7 の場合

最初にPythonとsetuptoolsをインストールします。 Pythonのインストールは、https://www.python.org/downloads/windows/  から2.7系の最新版をダウンロードして導入します。 環境変数のPathにC:\Python27;C:\Python27\Scriptsを加えます。

次にWindows PowerShellを起動してsetuptoolsを次のコマンドを実行します。詳しい解説は、https://pypi.python.org/pypi/setuptools  のページにあります。

    (Invoke-WebRequest https://bootstrap.pypa.io/ez_setup.py).Content | python -
    exit

次に、pipなど必要なソフトウェアを導入していきます。

    easy_install pip
    pip install softlayer
    pip install requests==2.5.3

Windowsのgitは、https://msysgit.github.io/  からダウンロードしてインストールします。環境変数のPathにgitの導入先のC:\Program Files (x86)\Git\binを追加します。コマンド プロンプトを起動してクローンを作成します。

    git clone https://github.com/takara9/usertool.git
    ls
    README.md  x1_add_user.py  x2_list_user.py  x3_del_user.py

この後は他のOSと同じです。



### usernameとapi-keyの取得方法

SOFTLAYERのポータル画面で、Account -> Users へ進み、実行したいユーザー名の行で、API Keyの列で、GenerateをクリックするとViewに変わる。　このViewをクリックして、表示されたAPI Keyをコピペして利用する。


##使い方

それぞれのファイルのヘッダー部分に、利用法を記載してあります。次の使い方は、x1_add_user.pyのヘッダー部分に記載したものです。

- 初回だけ実行ユーザーのユーザーIDとAPI-KEYをインプットする(1)
- ユーザーの属性情報(2)を編集して、利用目的に則した内容にする
- ユーザーに与える権限のリスト(3)を編集（そのままでもOK）
- 本プログラムの実行
- 作成するユーザー数をインプット
- ユーザーIDとパスワードのリストをコピペして保存
- 実行結果の確認（ポータルのAccount->Usersで確認)
- 演習ユーザーの利用(ハンズオン・セッション）
- ユーザーの削除 x3_del_user.py


##使用例

###(a) ユーザー追加

このコマンドは、子ユーザーを作成して、パーミションの設定、アクセス制御の設定を実行します。以下のusernameとpasswordをコピペして、セッションの参加者に配布します。

    $./x1_add_user.py
    How many the child user id do you want to add ? 3
    Current User = hack91800
    username = hack71187  password = ddnSeF$7
    username = hack71188  password = dgUygm#2
    username = hack71189  password = hropnH!8

このコマンドを実行するユーザーは、プライマリ・アカウントである必要はありません。子ユーザーで、さらに子、プライマリ・アカウントからは孫になるユーザーを作ることができます。


###(b) ユーザーのリスト表示

子ユーザーをリストします。子ユーザーを作る前に、このコマンドで既存の子ユーザーを確認できます。

    $ ./x2_list_user.py
    Current User = hack91800
    Username               id        firstName                 lastName
    hack71187              367237    Hands on user             expire in 3 days
    hack71188              367239    Hands on user             expire in 3 days
    hack71189              367241    Hands on user             expire in 3 days　


###(c) ユーザーの削除
自ユーザーの子ユーザーを一括削除します。

    $ ./x3_del_user.py
    Current User = hack91800
    Username               id        userStatusId
    hack71187              367237    1001
    hack71188              367239    1001
    hack71189              367241    1001



##注意点

子ユーザーを一括で削除するので、必要なユーザー全てを消す可能性があります。
ソフトレイヤーの制約により、削除した同じユーザー名は、しばらく再利用できません。



##作成者  

高良 真穂 (Maho Takara)
takara@jp.ibm.com, takara9@gmail.com, @MahoTakara
https://www.facebook.com/profile.php?id=100002198440895


##日付
  2015/5/8  初版リリース
  2015/8/13 ユーザーIDとAPI-KEYを初回実行時だけ入力する様に改良
