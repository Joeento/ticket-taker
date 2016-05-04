# Ticket Taker
In order to get into a summer movie without having to arrive 2 hours early on Long Island, you need to use a theater that lets you choose your seats online.  But, the only theater that does that doesn't do early tickets for 2D movies, so I put together a node script that'll check their site every couple of minutes and then text me whenever it finds that there are 2D tickets on the day I chose at a reasonable good time(NOT 10am, if possible).

##### How It Works
Unfortunately, Fandango doesn't offer an open API.  However, they do have random, hidden meta tags with strict schemas embedded into their site with all the info you'd need.  So, thanks to [cheerio](https://github.com/cheeriojs/cheerio), a jQuery like DOM scraper, we can read through the metadata and extract times.  After that, it's just a matter of sending the text.  Down the line, it would be nice to use an actual phone API for sending, ~~but Twilio phone numbers cost $1 and my wallet was all the way on the other side of the room.~~(UPDATE: Twilio support has been added!)

##### Set-up

Installation is super-simple, as always, once the repo is cloned, you'll need to add your personal twilio info to the config file.  To save time you can run 
```
cp config_example.js config.js
```
and use the template!  Once that's ready, run

```
npm install
```
to install the in-use libraries and you'll be good to go! Currently, the script accepts zip code, theater name, and date(mm/dd/YYYY) as parameters, which can be included like so:
```
node index.js --date=5/6/2016 --zip=11566 --theater="AMC Levittown 10"
```
Although, we reccomend you add the above command to your crontab, so that the minute tickets become available, you'll know.