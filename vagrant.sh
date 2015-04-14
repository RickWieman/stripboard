 #!/usr/bin/env bash

apt-get update

apt-get install -y apache2
apt-get install -y vim

rm -rf /var/www
ln -fs /vagrant/public /var/www

service apache2 restart
