document.addEventListener("DOMContentLoaded", function() {
  function waitForDivAndCreateChart() {
      const chartDiv = document.getElementById("chartdiv");
      const interval = setInterval(() => {
          const width = chartDiv.offsetWidth;
          const height = chartDiv.offsetHeight;
          if(width > 0 && height > 0){
              clearInterval(interval);
              createGlobeChart();
          }
      }, 50);
  }

  waitForDivAndCreateChart();

  function createGlobeChart() {
      var root = am5.Root.new("chartdiv");
      window.root = root; 

      root.setThemes([
          am5themes_Animated.new(root)
      ]);

      var chart = root.container.children.push(
          am5map.MapChart.new(root, {
              panX: "rotateX",
              panY: "rotateY",
              projection: am5map.geoOrthographic(),
              paddingBottom: 20,
              paddingTop: 20,
              paddingLeft: 20,
              paddingRight: 20,
              rotationX: -55.27, 
              rotationY: -25.2,
              zoomLevel: 2
          })
      );

      var polygonSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
              geoJSON: am5geodata_worldLow
          })
      );

      polygonSeries.mapPolygons.template.setAll({
          tooltipText: "{name}",
          interactive: true,
          fill: am5.color(0xe0e0e0),
          stroke: am5.color(0xffffff),
          strokeWidth: 0.5
      });

      polygonSeries.mapPolygons.template.states.create("hover", {
          fill: am5.color(0xbfa76a)
      });

      const countryColors = {
          AE: am5.color(0xc9a24d),
          SA: am5.color(0x8bc34a),
          JO: am5.color(0x03a9f4),
          QA: am5.color(0x9c27b0),
          OM: am5.color(0xff9800),
          YE: am5.color(0xf44336),
          US: am5.color(0x3f51b5)
      };

      polygonSeries.events.on("datavalidated", function () {
          polygonSeries.mapPolygons.each(function (polygon) {
              var id = polygon.dataItem.get("id");
              if (countryColors[id]) {
                  polygon.set("fill", countryColors[id]);
              }
          });
      });

      polygonSeries.mapPolygons.template.on("click", function (ev) {
          var polygon = ev.target;
          var centroid = polygon.geoCentroid();
          if (centroid) {
              chart.animate({
                  key: "rotationX",
                  to: -centroid.longitude,
                  duration: 1200,
                  easing: am5.ease.inOut(am5.ease.cubic)
              });
              chart.animate({
                  key: "rotationY",
                  to: -centroid.latitude,
                  duration: 1200,
                  easing: am5.ease.inOut(am5.ease.cubic)
              });
          }
      });

      var backgroundSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {})
      );

      backgroundSeries.mapPolygons.template.setAll({
          fill: am5.color(0x000000),
          fillOpacity: 0.05,
          strokeOpacity: 0
      });

      backgroundSeries.data.push({
          geometry: am5map.getGeoRectangle(90, 180, -90, -180)
      });

      chart.appear(1000, 100);

      window.addEventListener("resize", function() {
          setTimeout(function() {
              root.resize();
          }, 50);
      });
  }

});