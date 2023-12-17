const SerpApi = require('google-search-results-nodejs');
const fs = require ('fs')
const search = new SerpApi.GoogleSearch("042577b4184f0a2496b757891c05a4c85605ffc35544478e87f893daf1fb9f74");

const params = {
  engine: "google_jobs",
  q: "barista new york",
  hl: "en"
};

const callback = function(data) {

 // console.log(data["jobs_results"]);
  fs.writeFile('mynewfile3.json', JSON.stringify(data["jobs_results"]), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
};

// Show result as JSON
search.json(params, callback);
