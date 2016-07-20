window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);
        }
    }
    var center = {lat: 55.9486, lng: -3.1999}
    var map = new Map( center, 15 );

    request.send();

};

var Map = function(latLng, zoom) {
  this.googleMap = new google.maps.Map( document.getElementById( 'map'), {
    center: latLng,
    zoom: zoom
  })

this.addMarker = function(latLng, title) {
  var marker = new google.maps.Marker( {
    position: latLng,
    map: this.googleMap,
    title: title
  })
  return marker;
}

this.bindClick = function() {
  this.counter = 1;
  google.maps.event.addListener( this.googleMap, 'click', function(e) {
    var latLng = {lat: e.latLng.lat(), lng: e.latLng.lng() };
    this.addMarker( latLng, this.counter.toString());
    this.counter++
  }.bind(this))
}

this.addInfoWindow = function(latLng, title) {
  var marker = this.addMarker( latLng, title)
  marker.addListener( 'click', function() {
    var infoWindow = new google.maps.InfoWindow( {
      content: this.title
    })
      infoWindow.open(this.map, marker)
  })
}

}

var getLatLng = function(country) {
    var latLng = {lat:country.latlng[0], lng:country.latlng[1]};
    return latLng;
}

var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }
    updateDisplay(selected);
    document.querySelector('#info').style.display = 'block';
}

var populateSelect = function (countries) {
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var country = countries[index];
        updateDisplay(country);
        localStorage.setItem("selectedCountry",JSON.stringify(country));
    });
}

var updateDisplay = function (country) {
    // var tags = document.querySelectorAll('#info p');
    // tags[0].innerText = country.name;
    // tags[1].innerText = country.population;
    // tags[2].innerText = country.capital;
    var map = new Map(getLatLng(country), 5)
    // map.addMarker(getLatLng(country), '')
    var title = 'Welcome to ' + country.name + '!' + '<hr></hr>' + 'Did you know that ' + country.population + ' people live here?' + '<hr></hr>' + country.capital + ' is the capital!'
    map.addInfoWindow(getLatLng(country), title)
    


}

// // - Display a map centered on the selected country- done
// - Add a marker to the country- done
// - Add an info window to the marker displaying the country statistics - done
// ​
// Further: Add new Functionality. eg
//   - Add a find my country button; displaying the country based on the users location.
//   - Interactive map; clicking map updates the panel for the showing country.

