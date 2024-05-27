wordpress01 Cookbook
====================
このクックブックを適用することで、以下の事が実現できます。

- リポジトリから最新状態に更新
- Nginx と php-fpm の導入と設定
- MySQL の導入と設定
- Wordpressの最新版の導入

実行後に以下のURLをアクセスして、Wordpressのインストールを完了します。

    http://IPアドレス/wordpress/


要件(Requirements)
------------

現在対応しているサーバーのOSは、Ubuntu 14.04 LTS 64bit です。



属性(Attributes)
----------

このクックブックでパスワード等の部分は attiributes/default に分離してあります。
もちろん、デフォルト値のままでも動作します。

#### wordpress01::default
<table>
  <tr>
    <th>Key</th>
    <th>Type</th>
    <th>Description</th>
    <th>Default</th>
  </tr>
  <tr>
    <td>["mysql"]["root_password"]</td>
    <td>String</td>
    <td>MySQL root パスワード</td>
    <td>passw0rd</td>
  </tr>
  <tr>
    <td>["mysql"]["db_name"]</td>
    <td>String</td>
    <td>Wordpress DB名</td>
    <td>wordpress</td>
  </tr>
  <tr>
    <td>["mysql"]["user"]["name"]</td>
    <td>String</td>
    <td>Wordpress DBユーザー名</td>
    <td>wordpress</td>
  </tr>
  <tr>
    <td>["mysql"]["user"]["password"]</td>
    <td>String</td>
    <td>Wordpress DBパスワード</td>
    <td>wordpress</td>
  </tr>
  <tr>
    <td>["mysql"]["hostname"]</td>
    <td>String</td>
    <td>MySQLのホスト名</td>
    <td>localhost</td>
  </tr>
</table>


Usage
-----
#### wordpress01::default

`run_list`にから実行する場合の記述例です。

```json
{
  "name":"my_node",
  "run_list": [
    "recipe[wordpress01]"
  ]
}
```


#### プロビジョニング・スクリプト等からの実行

スタンドアロンのCHEF環境で自サーバーに適用する場合、root ユーザーで以下のコマンドを実行することで、インストールとセットが完了します。

```
# curl -L https://www.opscode.com/chef/install.sh | bash
# knife cookbook create dummy -o /var/chef/cookbooks
# git -C /var/chef/cookbooks clone https://github.com/takara9/wordpress01
# chef-solo -o wordpress01
```

Contributing
------------
TODO: (optional) If this is a public cookbook, detail the process for contributing. If this is a private cookbook, remove this section.

e.g.
1. Fork the repository on Github
2. Create a named feature branch (like `add_component_x`)
3. Write your change
4. Write tests for your change (if applicable)
5. Run the tests, ensuring they all pass
6. Submit a Pull Request using Github

License and Authors
-------------------
Authors: Maho Takara 
