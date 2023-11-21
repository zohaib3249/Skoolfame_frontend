#make build
#npm run build
#if any 'ERR_OSSL_EVP_UNSUPPORTED'
export NODE_OPTIONS=--openssl-legacy-provider




/var/www/html/
ssh -i "skoolfamev2.pem" ubuntu@ec2-34-229-172-155.compute-1.amazonaws.com

scp -ri skoolfamev2.pem build/ ubuntu@ec2-34-229-172-155.compute-1.amazonaws.com:/home/ubuntu

scp -ri skoolfamev2.pem build/ ubuntu@ec2-34-229-172-155.compute-1.amazonaws.com:/home/ubuntu
sudo rm -rf /var/www/html/skoolfame_api/build/
mv build /var/www/html/skoolfame_api
 sudo systemctl restart skoolfame
 sudo systemctl restart skoolfame