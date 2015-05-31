# grabbag
random grab bag of scripts

Script #1:  Crypto Fun With NodeJS

This script is simple.  It grabs coin data from three exchanges: BTC-E, Cryptsy, and Bittrex.  It only parses best buy data for three different coins, but you get the idea.  The design is scalable, so it should be easy to add a few more coins, or a few more exchange api's.

The script is called ibn.js.  You can run it with the command "nodejs ibn.js" .

It requires the "Q" package, which is currently a well-maintained promises library with a nice api, and can be installed using npm with: "npm install q --save" .

The queries to the exchange api's can all be done asynchronously, and vanilla nodejs handles this perfectly. However, in order to find the best market buy prices we have to do a comparison at the end of the script, requiring us to re-synchronize. This is where promises are handy. Using the Q module we are able to have our comparison routine wait for all of the api calls to finish before executing.

Two variables are written to the output console. The first is our main data structure: a nested dictionary of best market buy prices arranged by market and then exchange. The second simply identifies the best exchange for each market. One should be able to confirm visually that the best exchanges actually have the lowest prices.
