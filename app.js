// Importing Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
const converter = require("json-2-csv");
const fs = require("fs");

// Function to convert from JSON to csv and write to file
function writeCsv(data) {
  //   console.log(data);
  converter.json2csv(data, function (err, csvData) {
    // console.log(csvData);
    fs.writeFileSync("data/result.csv", csvData);
  });
}

// Function to fetch data from wikipedia page
function fetchData(url) {
  axios
    .get(url)
    .then(function (response) {
      // Creating Cheerio object from html data
      const $ = cheerio.load(response.data);
      // Fetching the desired table and converting it to JSON
      let result = $("#views-aggregator-datatable tbody tr")
        .map((i, el) => ({
          solutions: $(el).find("td.views-field-title").text().trim(),
          sector: $(el).find("td.views-field-nothing").text().trim(),
          scenario_one: $(el)
            .find("td.views-field-field-gigatons-reduced-pds1-")
            .text()
            .trim(),
          scenario_two: $(el)
            .find("td.views-field-field-gigatons-reduced-pds2-")
            .text()
            .trim(),
        }))
        .get();
      //   Coverting JSON result into csv
      writeCsv(result);
    })
    // Handling any axios error
    .catch(function (error) {
      console.log(error);
    });
}
// Function call for wikipedia road safety in Europe
fetchData("https://drawdown.org/solutions/table-of-solutions");
