# Ticket Taker
Getting tickets to a major blockbuster is hard.  Tickets appear online at random times and sell out fast.  Plus, now that every AMC offers reserve seating, if you're not online immediately, you and your friends are stuck at the front row.  TicketTaker makes sure that won't happen by scanning your favorite theater's data and letting you know via text when seats become available.

##### How It Works
Unfortunately, Fandango no longer hosts an easily parsable schema from which to get showtimes.  In fact, they've switched to loading showtimes via AJAX, making crawling the site more difficult than ever.  The good news, loading via AJAX also means there's a showtime JSON somewhere.  Once I found that(and faked a session), getting machine read-able data was a breeze.  Once TicketTaker has the data, it can easily be sifted through for good showtimes.  If any exist, it send the user a text message via Twilio, linking them back to the page where you can buy tickets.  Everyone wins...in a way.

##### Set-up

Installation onto your server  pretty simple. Once the repo is cloned, you'll need to add some info to the config file.  You can start with a template by running:
```
cp config_example.js config.js
```
You'll need a Twilio phone number in order to be able to send texts from the system.  Additionally, in order to get showtimes info, you'll need session data from Fandango.  The easiest way to do this is to naviate to one of their movie pages, open the inspector, and look at the request data that gets sent to [https://www.fandango.com/napi/theaterShowtimeGroupings](https://www.fandango.com/napi/theaterShowtimeGroupings), and copy the field labelled `cookie`.  Here's what that would look like in Chrome:
[https://raw.githubusercontent.com/Joeento/ticket-taker/master/example.png]

Then, just run:
```
npm install
```
to install the in-use libraries and you'll be good to go! Currently, the script accepts zip code, theater name, and date(YYYY-mm-dd), and movie slug(from the Fandango URL) as parameters.  For example, if you'd like to see Thor: Ragnarok on Saturday the 4th, at the AMC in Levittown, NY, you would enter: 
```
node index.js --zip 11566 --date 2017-11-04 --movie_slug thor:ragnarok2017-199155 --theater "AMC Dine-in Levittown 10"
```
Although, we reccomend you add the above command to your crontab, so that the minute tickets become available, you'll know.

Happy hunting!