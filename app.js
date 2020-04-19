const express = require("express");
const bodyParser = require("body-parser");
const unirest = require("unirest");
const _ = require("lodash");
const fetch = require("node-fetch");

let countries;
let country = "India";
var world_stats, country_stats, india_status;

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

// var serve = unirest(
//   "GET",
//   "https://coronavirus-monitor.p.rapidapi.com/coronavirus/world_total_stat.php"
// );

// serve.headers({
//   "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
//   "x-rapidapi-key": "f9a8a5b0eemsh7d728929b6747e7p161899jsn9bb7591ffe1c"
// });

// serve.end(function(res) {
//   if (res.error) throw new Error(res.error);
//   world_stats = JSON.parse(res.body);
//   // console.log(world_stats);
// });

function indianFormat(x) {
  let lastThree = x.substring(x.length - 3);
  let otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != "") lastThree = "," + lastThree;
  let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return result;
}
fetch("https://corona.lmao.ninja/v2/all?yesterday=false")
  .then((res) => res.json())
  .then((json) => {
    world_stats = json;
    //console.log(typeof(world_stats.cases.toString()));

    serve = unirest(
      "GET",
      "https://coronavirus-monitor.p.rapidapi.com/coronavirus/affected.php"
    );

    serve.headers({
      "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      "x-rapidapi-key": "f9a8a5b0eemsh7d728929b6747e7p161899jsn9bb7591ffe1c",
    });

    serve.end(function (res) {
      if (res.error) throw new Error(res.error);
      countries = JSON.parse(res.body);
      //console.log(countries.affected_countries);
    });
    app.get("/", (req, res) => {
      // serve = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php");

      // serve.query({
      //     "country": "india"
      // });

      // serve.headers({
      //     "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      //     "x-rapidapi-key": "f9a8a5b0eemsh7d728929b6747e7p161899jsn9bb7591ffe1c"
      // });

      // serve.end(function (res) {
      //     if (res.error) throw new Error(res.error);
      //     india_status = JSON.parse(res.body);
      //     // console.log(country_stats);
      // });

      fetch(
        "https://corona.lmao.ninja/v2/countries/india?yesterday=false&strict=true"
      )
        .then((res) => res.json())
        .then((json) => {
          india_status = json;

          let today = new Date();
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
          };
          let india_status_total_cases = india_status.cases;

          res.render("home", {
            country: "india",
            today: today.toLocaleDateString("en-US", options),
            world_total: world_stats.cases
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_active: world_stats.active
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_recovered: world_stats.recovered
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_affected: world_stats.affectedCountries
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_dead: world_stats.deaths
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_dead_percentage: Math.floor(
              (Number(world_stats.deaths) / Number(world_stats.cases)) * 100
            ),
            india_total: india_status_total_cases
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            india_total_percentage: Math.ceil(
              (Number(india_status_total_cases) / Number(world_stats.cases)) *
                100
            ),
            india_active: india_status.active
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            india_active_cases_percentage: Math.ceil(
              (Number(india_status.active) / Number(india_status_total_cases)) *
                100
            ),
            india_recovered: india_status.recovered
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            india_recovered_percentage: Math.ceil(
              (Number(india_status.recovered) /
                Number(india_status_total_cases)) *
                100
            ),
            india_critical: india_status.critical
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            india_critical_percentage: Math.ceil(
              (Number(india_status.critical) /
                Number(india_status_total_cases)) *
                100
            ),
            india_dead: india_status.deaths
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            india_dead_percentage: Math.ceil(
              (Number(india_status.deaths) / Number(india_status_total_cases)) *
                100
            ),
          });
        });
    });

    app.get("/test-centers", (req, res) => {
      res.render("test-centers", {
        country: "INDIA",
      });
    });

    app.get("/helpline", (req, res) => {
      res.render("helpline", {
        country: "INDIA",
      });
    });

    app.get("/sources", (req, res) => {
      res.render("sources", {
        country: "",
      });
    });

    app.get("/country/:countryName", (req, res) => {
      country = _.lowerCase(req.params.countryName);
      // serve = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php");

      // serve.query({
      //     "country": country
      // });

      // serve.headers({
      //     "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      //     "x-rapidapi-key": "f9a8a5b0eemsh7d728929b6747e7p161899jsn9bb7591ffe1c"
      // });

      // serve.end(function (res) {
      //     if (res.error) throw new Error(res.error);
      //     country_stats = JSON.parse(res.body);
      //     // console.log(country_stats);
      // });
      fetch(
        "https://corona.lmao.ninja/v2/countries/" +
          country +
          "?yesterday=false&strict=true"
      )
        .then((res) => res.json())
        .then((json) => {
          country_stats = json;

          let today = new Date();
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
          };
          let country_total_cases = country_stats.cases;

          // if (country_stats.latest_stat_by_country[0].serious_critical == "")
          //     country_stats.latest_stat_by_country[0].serious_critical = "0";
          res.render("base", {
            country: country,
            today: today.toLocaleDateString("en-US", options),
            world_total: world_stats.cases
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_active: world_stats.active
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_recovered: world_stats.recovered
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_affected: world_stats.affectedCountries
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_dead: world_stats.deaths
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            world_dead_percentage: Math.floor(
              (Number(world_stats.deaths) / Number(world_stats.cases)) * 100
            ),
            country_total: country_total_cases
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            country_total_percentage: Math.ceil(
              (Number(country_total_cases) / Number(world_stats.cases)) * 100
            ),
            country_active: country_stats.active
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            country_active_cases_percentage: Math.ceil(
              (Number(country_stats.active) / Number(country_total_cases)) * 100
            ),
            country_recovered: country_stats.recovered
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            country_recovered_percentage: Math.ceil(
              (Number(country_stats.recovered) / Number(country_total_cases)) *
                100
            ),
            country_critical: country_stats.critical
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            country_critical_percentage: Math.ceil(
              (Number(country_stats.critical) / Number(country_total_cases)) *
                100
            ),
            country_dead: country_stats.deaths
              .toString()
              .replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            country_dead_percentage: Math.ceil(
              (Number(country_stats.deaths) / Number(country_total_cases)) * 100
            ),
          });
        });
    });
  });
app.get("/affected-countries", (req, res) => {
  res.render("affectedCountries", {
    affectedCountries: countries.affected_countries,
    country: "",
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

// https://corona.lmao.ninja/countries/india
