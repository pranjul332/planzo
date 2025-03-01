const https = require("https");
const URL =
  "https://indianrailapi.com/api-collection";
https
  .get(URL, (resp) => {
    let data = "";
    // A chunk of data has been recieved.
    resp.on("data", (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on("end", () => {
      console.log(JSON.parse(data));
    });
  })
  .on("error", (err) => {
    console.error("Error: " + err.message);
  });
