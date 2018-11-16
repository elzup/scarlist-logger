## Logger of scarlist

[scarlist](https://github.com/elzup/scarlist)

### configuration

```
cp config_sample.json config.json
```

### env

- node
- yarn
- arp-scan

Raspberry pi setup

```
# node
sudo apt-get update
sudo apt-get install -y nodejs npm
sudo npm cache clean
sudo npm install npm n -g
sudo n stable

# arp-scan
sudo apt-get install arp-scan

# yarn
npm i -g yarn

# cron
sudo crontab -u root -e
```

cron

```
* * * * * /usr/local/bin/node /home/pi/scarlist-logger/index.js
```
