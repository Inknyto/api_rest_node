# api_rest_node
This is the repository for my REST api. it uses Node js, and Express js. It can also be started with PM2. Enjoy!

# api_rest_node v2
This is the second version of my Rest Api. It now has two entry points. You can run simultaneously the two entry points which are index.js and server.js. 

The index.js has the following endpoints: /app/data, /app/datadk and /app/data2. It provides data from json files. 

The second entry point is server.js. It is a more advanced entrypoint as it uses a Postgresql database, and supports various methods such as GET, POST, PUT and DELETE. it also has an admin page which will be uploaded very soon. 

The index.js has the following endpoints: /, /electronique, /electromenager and /luminaire. It provides data from a Postgresql database named dall_diamm_api. The default port is 3000. 



To run the two entry points simultaneously you can use these scripts: 

```
pm2 start index.js --name 'Jobs Data' --watch
pm2 start server.js --name 'Dall Diamm' --watch

```
You can also start in cluster mode by adding the number of instances. 
For example:
```
pm2 start index.js -i 4 --name 'Jobs Data' --watch
pm2 start server.js -i max--name 'Dall Diamm' --watch

```


Enjoy!!
