# grabbag
random grab bag of scripts

Script #1:  Crypto Fun With NodeJS

This script is simple.  It grabs coin data from three exchanges using their nodejs api's: BTC-E, Cryptsy, and Bittrex.  It only parses market buy data for three different coins, but you get the idea.  The design is scalable, so it should be easy to add a few more coins, or a few more exchange api's.

The queries to the exchange api's can all be done asynchronously, and vanilla nodejs handles this perfectly. However, in order to find the **best** market buy prices we have to do a comparison at the end of the script, requiring us to re-synchronize. This is where promises come in. Using the Q module's deferred promises we are able to have our comparison routine wait for all of the api calls to finish before executing the final steps of our script.

Finally, two variables are logged to the console. The first is our main data structure: a nested dictionary of best market buy prices arranged by market and then exchange. The second simply identifies the best exchange for each market. One should be able to confirm visually from these two objects that the best exchanges actually have the lowest prices.

The script is called ibn.js.  You can run it with the command:

  nodejs ibn.js

It requires the "Q" package, which is currently a well-maintained promises library with a nice api, and can be installed using npm with:

  npm install q --save

Install the nodejs exchange apis with npm:

  npm install btce --save
  
  npm install cryptsy --save
  
  npm install node.bittrex.api --save
