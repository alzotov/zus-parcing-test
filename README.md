# zus-parcing-test

Application requires: 

 - Redis, the easiest way to install is on Docker:
https://redis.io/docs/install/install-stack/docker/

 - Node.js (let's not forget to run: npm install in project folder)

Run:
 - Redis on Docker:
docker run -d -p 6379:6379 redis
    6379 - default port, let's stick to it 

 - backend:
node index.js - it will parse ZUS locations and serve them thru API on localhost:3000

 - frontend:
launch index.html in any browser, backend must be run on same machine
