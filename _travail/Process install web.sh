#!/bin/bash
cd ~
sudo apt update
sudo apt upgrade -y

### MYSQL ###
sudo apt install mysql-server -y

sudo apt install expect  -y

SECURE_MYSQL=$(expect -c "
set timeout 10
spawn mysql_secure_installation
expect \"Enter current password for root (enter for none):\"
send \"WycaRoot31Passw@rd\r\"
expect \"Change the root password?\"
send \"n\r\"
expect \"Remove anonymous users?\"
send \"y\r\"
expect \"Disallow root login remotely?\"
send \"y\r\"
expect \"Remove test database and access to it?\"
send \"y\r\"
expect \"Reload privilege tables now?\"
send \"y\r\"
expect eof
")

echo "$SECURE_MYSQL"

sudo apt purge expect -y

# Init mysql config 
mysql -uroot -pWycaRoot31Passw@rd -h127.0.0.1 -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'WycaRoot31Passw@rd';
FLUSH PRIVILEGES;"

# Config mysql
{
        echo '[mysqld]'
        echo 'sql_mode=ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'
} | sudo tee /etc/mysql/conf.d/disabled_strict_mode.cnf

sudo systemctl restart mysql

### imagick ###
sudo apt install imagemagick
sudo apt install php-imagick -y

### Config apache ###
sudo apt install libapache2-mod-php7.2 
sudo apt install php7.2-mysql

sudo a2enmod rewrite
sudo a2enmod ssl

sudo systemctl restart apache2


### Chrome ###
sudo apt install chromium-browser
