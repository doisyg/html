### Conf apache ###
{
        echo '<VirtualHost *:80>'
        echo '	ServerAdmin webmaster@localhost'
        echo '	DocumentRoot /var/www/html'
        echo '	ErrorLog ${APACHE_LOG_DIR}/error.log'
        echo '	CustomLog ${APACHE_LOG_DIR}/access.log combined'
        echo '	<Directory /var/www/html/>'
        echo '		Options Indexes FollowSymLinks'
        echo '		AllowOverride All'
        echo '		Require all granted'
        echo '	</Directory>'
        echo '</VirtualHost>'
        echo ''
        echo '# vim: syntax=apache ts=4 sw=4 sts=4 sr noet'
} | sudo tee /etc/apache2/sites-available/000-default.conf

{
        echo '<IfModule mod_ssl.c>'
        echo '	<VirtualHost _default_:443>'
        echo '		ServerAdmin webmaster@localhost'
        echo '		DocumentRoot /var/www/html'
        echo '		ServerName elodie.wyca-solutions.com'
        echo '		<Directory /var/www/html/>'
        echo '			Options Indexes FollowSymLinks'
        echo '			AllowOverride All'
        echo '			Require all granted'
        echo '		</Directory>'
        echo '		ErrorLog ${APACHE_LOG_DIR}/error.log'
        echo '		CustomLog ${APACHE_LOG_DIR}/access.log combined'
        echo '		SSLEngine on'
        echo '		SSLCertificateFile	/etc/ssl/certs/elodie.wyca-solutions.com.crt'
        echo '		SSLCertificateKeyFile /etc/ssl/private/elodie.wyca-solutions.com.key'
        echo '		<FilesMatch "\.(cgi|shtml|phtml|php)$">'
        echo '				SSLOptions +StdEnvVars'
        echo '		</FilesMatch>'
        echo '		<Directory /usr/lib/cgi-bin>'
        echo '				SSLOptions +StdEnvVars'
        echo '		</Directory>'
        echo '	</VirtualHost>'
        echo '</IfModule>'
        echo ''
        echo '# vim: syntax=apache ts=4 sw=4 sts=4 sr noet'
} | sudo tee /etc/apache2/sites-enabled/elodie.conf


### Edit /etc/hosts, add
{
        echo '127.0.0.1	elodie.wyca-solutions.com'
} | sudo tee -a /etc/hosts



### Conf mysql ###

mysql -uroot -pWycaRoot31Passw@rd -h127.0.0.1 -e "CREATE DATABASE IF NOT EXISTS wyca_elodie;
CREATE USER IF NOT EXISTS 'elodie'@'localhost' IDENTIFIED BY 'Elodie@31Www';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON wyca_elodie.* TO 'elodie'@'localhost';
FLUSH PRIVILEGES;"

# Clone Elodie www repo
sudo mv /var/www/html /var/www/html_save
sudo chmod 777 /var/www
cd /var/www
git clone https://github.com/doisyg/elodie-www html

mysql -u elodie --password=Elodie@31Www wyca_elodie < /var/www/html/_install_/database.sql
sudo cp /var/www/html/__install__/ssl/elodie.wyca-solutions.com.crt /etc/ssl/certs/elodie.wyca-solutions.com.crt
sudo cp /var/www/html/__install__/ssl/elodie.wyca-solutions.com.key /etc/ssl/private/elodie.wyca-solutions.com.key

sudo rm -r /var/www/html/__install__

sudo chmod 755 /var/www

sudo chown -Rv root:www-data /var/www/html/robot_config
sudo chmod -R g+w /var/www/html/robot_config

cd ~

sudo systemctl restart apache2




