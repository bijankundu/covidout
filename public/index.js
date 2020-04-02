let total, recovered, dead;

function formatDate(date) {
  let time = new Date(date);
  const options = {
    day: "numeric",
    month: "short"
  };
  let k = time.toLocaleDateString("en-US", options);
  // console.log(k);
  return k;
}
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://corona.lmao.ninja/v2/historical/india", true);
xhr.send();

xhr.onreadystatechange = processRequest;

function processRequest(e) {
  if (xhr.readyState == 4 && xhr.status == 200) {
    var response = JSON.parse(xhr.responseText);
    total = Object.entries(response.timeline.cases);
    recovered = Object.entries(response.timeline.recovered);
    dead = Object.entries(response.timeline.deaths);
    total.forEach(ele => {
      ele[0] = formatDate(ele[0]);
      //console.log(ele);
    });
    recovered.forEach(ele => {
      ele[0] = formatDate(ele[0]);
      //console.log(ele);
    });
    dead.forEach(ele => {
      ele[0] = formatDate(ele[0]);
      //console.log(ele);
    });
    total.unshift(["Date", "Confirmed Cases"]);
    recovered.unshift(["Date", "Recovered"]);
    dead.unshift(["Date", "Deaths"]);
    //console.log(total);

    google.charts.load("current", {
      packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable(total);

      var options = {
        title: "CONFIRMED CASES ",
        titleTextStyle: {
          color: "#636161", // any HTML string color ('red', '#cc00cc')
          fontName: "'Roboto Slab', serif", // i.e. 'Times New Roman'
          fontSize: 20 // 12, 18 whatever you want (don't specify px)
          // bold: < boolean > , // true or false
          // italic: < boolean > // true of false
        },
        curveType: "none",
        legend: "none",
        colors: ["red"]
      };

      var chart = new google.visualization.LineChart(
        document.getElementById("confirmed")
      );

      chart.draw(data, options);
    }
    google.charts.load("current", {
      packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(drawChart2);

    function drawChart2() {
      var data = google.visualization.arrayToDataTable(recovered);

      var options = {
        title: "RECOVERED",
        titleTextStyle: {
          color: "#636161", // any HTML string color ('red', '#cc00cc')
          fontName: "'Roboto Slab', serif", // i.e. 'Times New Roman'
          fontSize: 20 // 12, 18 whatever you want (don't specify px)
          // bold: < boolean > , // true or false
          // italic: < boolean > // true of false
        },
        curveType: "none",
        legend: "none",
        colors: ["green"]
      };

      var chart = new google.visualization.LineChart(
        document.getElementById("recovered")
      );

      chart.draw(data, options);
    }
    google.charts.load("current", {
      packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(drawChart3);

    function drawChart3() {
      var data = google.visualization.arrayToDataTable(dead);

      var options = {
        title: "DEAD ",
        titleTextStyle: {
          color: "#636161", // any HTML string color ('red', '#cc00cc')
          fontName: "'Roboto Slab', serif", // i.e. 'Times New Roman'
          fontSize: 20 // 12, 18 whatever you want (don't specify px)
          // bold: < boolean > , // true or false
          // italic: < boolean > // true of false
        },
        curveType: "none",
        legend: "none",
        colors: ["#636161"]
      };

      var chart = new google.visualization.LineChart(
        document.getElementById("dead")
      );

      chart.draw(data, options);
    }
  }
}

//state chart
function stateChart() {
  let result,
    data = [];
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.covid19india.org/state_district_wise.json",
    true
  );
  xhr.send();

  xhr.onreadystatechange = processRequest;

  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      result = Object.entries(response);

      result.forEach(ele => {
        let temp = Object.entries(ele[1].districtData);
        if (ele[0] != "Unknown") {
          data.push([ele[0], 0, getRandomColor()]);
          temp.forEach(element => {
            data[data.length - 1][1] += Number(element[1].confirmed);
          });
        }
      });
      data.unshift(["State", "Cases", { role: "style" }]);
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(bar);
      function bar() {
        var report = google.visualization.arrayToDataTable(data);
        report.sort([{ column: 1, desc: true }]);
        var view = new google.visualization.DataView(report);
        view.setColumns([
          0,
          1,
          {
            calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation"
          },
          2
        ]);

        var options = {
          title: "State-wise cases",
          titleTextStyle: {
            color: "#636161", // any HTML string color ('red', '#cc00cc')
            fontName: "'Roboto Slab', serif", // i.e. 'Times New Roman'
            fontSize: 20 // 12, 18 whatever you want (don't specify px)
            // bold: < boolean > , // true or false
            // italic: < boolean > // true of false
          },
          bar: { groupWidth: "70%" },
          legend: { position: "none" }
        };
        var chart = new google.visualization.BarChart(
          document.getElementById("state-status")
        );
        chart.draw(view, options);
      }
      console.log(data);
    }
  }
}

stateChart();
