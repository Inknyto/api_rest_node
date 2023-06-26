# api_rest_node
This is the repository for my REST api. it uses Node js, and Express js. It can also be started with PM2. Enjoy!

The entry point is index.js. The api's server can be run with the command "node index.js".  
It can be ran as background process with "node index.js &". 

The server can also be daemonized with pm2 process manager with "pm2 start index.js". It can be ran in cluster mode with "pm2 start index.js -i max". 

The default running port of the server is 4567.
The api's endpoints are "localhost:4567/app/data", "localhost:4567/app/datadk" and "localhost:4567/app/data2". They can be easily modified by editing the "index.js" file. 

Enjoy!

