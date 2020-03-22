const express = require("express");
const bodyParser = require("body-parser");
const unirest = require("unirest");
const _ = require("lodash");

let effectedCountries = [];
let country = "India";
let world_stats, country_stats;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get("/", (req, res) => {

    let today = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    let country_total_cases = country_stats.latest_stat_by_country[0].total_cases;

    if (country_stats.latest_stat_by_country[0].serious_critical == "")
        country_stats.latest_stat_by_country[0].serious_critical = "0";
    res.render('base', {
        country: country,
        today: today.toLocaleDateString('en-US', options),
        world_total: world_stats.total_cases,
        world_new: world_stats.new_cases,
        world_recovered: world_stats.total_recovered,
        world_new_death: world_stats.new_deaths,
        world_dead: world_stats.total_deaths,
        world_dead_percentage: (Math.floor((Number(world_stats.total_deaths.replace(",", "")) / Number(world_stats.total_cases.replace(",", ""))) * 100)),
        country_total: country_total_cases,
        country_total_percentage: (Math.ceil((Number(country_total_cases.replace(",", "")) / Number(world_stats.total_cases.replace(",", ""))) * 100)),
        country_active: country_stats.latest_stat_by_country[0].active_cases,
        country_active_cases_percentage: (Math.ceil((Number(country_stats.latest_stat_by_country[0].active_cases.replace(",", "")) / Number(country_total_cases.replace(",", ""))) * 100)),
        country_recovered: country_stats.latest_stat_by_country[0].total_recovered,
        country_recovered_percentage: (Math.ceil((Number(country_stats.latest_stat_by_country[0].total_recovered.replace(",", "")) / Number(country_total_cases.replace(",", ""))) * 100)),
        country_critical: country_stats.latest_stat_by_country[0].serious_critical,
        country_critical_percentage: (Math.ceil((Number(country_stats.latest_stat_by_country[0].serious_critical.replace(",", "")) / Number(country_total_cases.replace(",", ""))) * 100)),
        country_dead: country_stats.latest_stat_by_country[0].total_deaths,
        country_dead_percentage: (Math.ceil((Number(country_stats.latest_stat_by_country[0].total_deaths.replace(",", "")) / Number(country_total_cases.replace(",", ""))) * 100))
    });
});


let req = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php");

req.headers({
    "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
    "x-rapidapi-key": "f9a8a5b0eemsh7d728929b6747e7p161899jsn9bb7591ffe1c"
});


req.end(function (res) {
    if (res.error) throw new Error(res.error);
    world_stats = JSON.parse(res.body);
    // console.log(world_stats);
});

req = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php");

req.query({
    "country": "india"
});

req.headers({
    "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
    "x-rapidapi-key": "f9a8a5b0eemsh7d728929b6747e7p161899jsn9bb7591ffe1c"
});


req.end(function (res) {
    if (res.error) throw new Error(res.error);
    country_stats = JSON.parse(res.body);
    // console.log(country_stats);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});