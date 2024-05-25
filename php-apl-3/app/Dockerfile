FROM centos:7

RUN yum install -y epel-release yum-utils
RUN yum install -y http://rpms.remirepo.net/enterprise/remi-release-7.rpm
RUN yum-config-manager --enable remi-php74
RUN yum install -y php php-common php-opcache php-mcrypt php-cli php-gd php-curl php-mysqlnd php-pdo php74-php-pdo php-fpm php74-php-pecl-redis5 php74-php-phpiredis php74-php-pecl-mysql php-mysql php-pecl-redis

COPY php_conf/php-fpm.conf /etc/php-fpm.conf
COPY php_conf/www.conf /etc/php-fpm.d/www.conf
COPY php_conf/php.ini /etc/php.ini
COPY php_apl /apl
COPY setup.sh /setup.sh
RUN  chmod a+x /setup.sh


STOPSIGNAL SIGQUIT

WORKDIR /var/www

EXPOSE 9000

CMD ["php-fpm"]
