import RedisClient from "redis";
// import RedisClustr from "redis-clustr";

export const client = RedisClient.createClient(6379);
// export const client = new RedisClustr({
//   servers: [
//     {
//       // host: "redis-elc.imyfuo.clustercfg.apse1.cache.amazonaws.com",
//       host: "127.0.0.1",
//       port: 6379,
//     },
//   ],
//   createClient: function (port, host) {
//     // this is the default behaviour
//     return RedisClient.createClient(port, host);
//   },
// });

export let redisConnected = false;
client.on("connect", () => {
  redisConnected = true;
  console.log("Redis client connected");
});
client.on("error", () => {
  redisConnected = false;
});
