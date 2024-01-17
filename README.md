# zus-parcing-test

Application requires: 

 - Redis, the easiest way to install is on Docker:
https://redis.io/docs/install/install-stack/docker/

 - Node.js

Run:
 - Redis on Docker:
docker run -d -p 6379:6379 redis
    6379 - default port, let's stick to it 

 - backend:
node index.js - it will parse and serve ZUS locations on localhost:3000

 - frontend:
launch index.html in any browser, backend must be run on same machine
