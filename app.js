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
    extended: true
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

fetch("https://corona.lmao.ninja/all")
  .then(res => res.json())
  .then(json => {
    world_stats = json;
    // console.log(world_stats);

    serve = unirest(
      "GET",
      "https://coronavirus-monitor.p.rapidapi.com/coronavirus/affected.php"
    );

    serve.headers({
      "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      "x-rapidapi-key": "f9a8a5b0eemsh7d728929b6747e7p161899jsn9bb7591ffe1c"
    });

    serve.end(function(res) {
      if (res.error) throw new Error(res.error);
      countries = JSON.parse(res.body);
      // console.log(countries.affected_countries);
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

      fetch("https://corona.lmao.ninja/countries/india")
        .then(res => res.json())
        .then(json => {
          india_status = json;

          let today = new Date();
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric"
          };
          let india_status_total_cases = india_status.cases;

          res.render("home", {
            country: "india",
            today: today.toLocaleDateString("en-US", options),
            world_total: world_stats.cases.toLocaleString().replace(" ", ","),
            world_active: world_stats.active.toLocaleString().replace(" ", ","),
            world_recovered: world_stats.recovered
              .toLocaleString()
              .replace(" ", ","),
            world_affected: world_stats.affectedCountries
              .toLocaleString()
              .replace(" ", ","),
            world_dead: world_stats.deaths.toLocaleString().replace(" ", ","),
            world_dead_percentage: Math.floor(
              (Number(world_stats.deaths) / Number(world_stats.cases)) * 100
            ),
            india_total: india_status_total_cases
              .toLocaleString()
              .replace(" ", ","),
            india_total_percentage: Math.ceil(
              (Number(india_status_total_cases) / Number(world_stats.cases)) *
                100
            ),
            india_active: india_status.active
              .toLocaleString()
              .replace(" ", ","),
            india_active_cases_percentage: Math.ceil(
              (Number(india_status.active) / Number(india_status_total_cases)) *
                100
            ),
            india_recovered: india_status.recovered
              .toLocaleString()
              .replace(" ", ","),
            india_recovered_percentage: Math.ceil(
              (Number(india_status.recovered) /
                Number(india_status_total_cases)) *
                100
            ),
            india_critical: india_status.critical
              .toLocaleString()
              .replace(" ", ","),
            india_critical_percentage: Math.ceil(
              (Number(india_status.critical) /
                Number(india_status_total_cases)) *
                100
            ),
            india_dead: india_status.deaths.toLocaleString().replace(" ", ","),
            india_dead_percentage: Math.ceil(
              (Number(india_status.deaths) / Number(india_status_total_cases)) *
                100
            )
          });
        });
    });

    app.get("/test-centers", (req, res) => {
      res.render("test-centers", {
        country: "INDIA"
      });
    });

    app.get("/helpline", (req, res) => {
      res.render("helpline", {
        country: "INDIA"
      });
    });

    app.get("/sources", (req, res) => {
      res.render("sources", {
        country: ""
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
      fetch("https://corona.lmao.ninja/countries/" + country)
        .then(res => res.json())
        .then(json => {
          country_stats = json;

          let today = new Date();
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric"
          };
          let country_total_cases = country_stats.cases;

          // if (country_stats.latest_stat_by_country[0].serious_critical == "")
          //     country_stats.latest_stat_by_country[0].serious_critical = "0";
          res.render("base", {
            country: country,
            today: today.toLocaleDateString("en-US", options),
            world_total: world_stats.cases.toLocaleString().replace(" ", ","),
            world_active: world_stats.active.toLocaleString().replace(" ", ","),
            world_recovered: world_stats.recovered
              .toLocaleString()
              .replace(" ", ","),
            world_affected: world_stats.affectedCountries
              .toLocaleString()
              .replace(" ", ","),
            world_dead: world_stats.deaths.toLocaleString().replace(" ", ","),
            world_dead_percentage: Math.floor(
              (Number(world_stats.deaths) / Number(world_stats.cases)) * 100
            ),
            country_total: country_total_cases
              .toLocaleString()
              .replace(" ", ","),
            country_total_percentage: Math.ceil(
              (Number(country_total_cases) / Number(world_stats.cases)) * 100
            ),
            country_active: country_stats.active
              .toLocaleString()
              .replace(" ", ","),
            country_active_cases_percentage: Math.ceil(
              (Number(country_stats.active) / Number(country_total_cases)) * 100
            ),
            country_recovered: country_stats.recovered
              .toLocaleString()
              .replace(" ", ","),
            country_recovered_percentage: Math.ceil(
              (Number(country_stats.recovered) / Number(country_total_cases)) *
                100
            ),
            country_critical: country_stats.critical
              .toLocaleString()
              .replace(" ", ","),
            country_critical_percentage: Math.ceil(
              (Number(country_stats.critical) / Number(country_total_cases)) *
                100
            ),
            country_dead: country_stats.deaths
              .toLocaleString()
              .replace(" ", ","),
            country_dead_percentage: Math.ceil(
              (Number(country_stats.deaths) / Number(country_total_cases)) * 100
            )
          });
        });
    });
  });
app.get("/affected-countries", (req, res) => {
  res.render("affectedCountries", {
    affectedCountries: countries.affected_countries,
    country: ""
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

// https://corona.lmao.ninja/countries/india
