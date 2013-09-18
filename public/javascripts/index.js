var map;

$(function() {

  // Initialize Mapbox.
  var container = $('#map');
  map = L.mapbox.map(container.get(0), 'strenuus.map-14j74ucy');

  // Returns the county geometry as topojson data.
  $.ajax({
    url: 'counties',
    dataType: 'json',
    success: onSuccess});
});

function onSuccess(data) {
  // Fill the choropleth layer, converting the topojson geometry to geojson.
  var layer = L.geoJson(null, {style: getStyle}).addTo(map);
  layer.addData(topojson.feature(data, data.objects.counties));

  // Show the state of Kansas.
  L.mapbox.geocoder('strenuus.map-14j74ucy').query('Kansas', function(err, data) {
    map.fitBounds(data.lbounds);
  });
}

function getStyle(feature) {
  // Style the counties and set the fill color based on the fill function.
  return {
    weight: 2,
    opacity: 0.1,
    color: 'black',
    fillOpacity: 0.7,
    fillColor: getFillColor(feature)
  };
}

function getFillColor(feature) {
  // Generate random comparison data for the state of Kansas.
  var value = 0;
  var id = feature.id.toString();
  if (id.length === 5 && id.indexOf("20") === 0) {
    value = Math.random() - 0.5;
  }

  // Assign a color to the value scaling from blue to white to orange.
  return d3.scale.linear()
    .domain([-0.25, 0, 0.25])
    .range(['#F5B178', '#FFF', '#7C8FD3'])
    .clamp(true)(value);
}
