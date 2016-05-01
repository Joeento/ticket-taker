# Ticket Taker
In order to get into a summer movie without having to arrive 2 hours early on Long Island, you need to use a theater that lets you choose your seats online.  But, the only theater that does that doesn't do early tickets for 2D movies, so I put together a node script that'll check their site every couple of minutes and then text me whenever it finds that there are 2D tickets on the day I chose at a reasonable good time(NOT 10am, if possible).

##### How It Works
Unfortunately, Fandango doesn't offer an open API.  However, they do have random, hidden meta tags with strict schemas embedded into their site with all the info you'd need.  So, thanks to [cheerio](https://github.com/cheeriojs/cheerio), a jQuery like DOM scraper, we can read through the metadata and extract times.  After that, it's just a matter of sending the text.  Down the line, it would be nice to use an actual phone API for sending, but Twilio phone numbers cost $1 and my wallet was all the way on the other side of the room.  Instead, we're using an old feature Verizon option that lets phones recieve emails as text if they're sent to {phoneNumber}@vtext.com, it also works for most other major carriers, but right now, the code just supports Gmail SMTP and Verizon.

##### Set-up
Installation is super-simple, as always, clone the repo and run
```
npm install
```