var map,
    cb,
    circle,
    markerSymbol,
    gl,
    mapMode,
    locateForMap,
    launchMap,
    launchSocial,
    addCircle,
    addPoint,
    bookTitle,
    bookId,
    bookAuthor,
    locat,
    localX,
    localY,
    books = {},
    counter = 0;

require(["esri/map", "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
  "esri/Color", "esri/geometry/Point", "esri/geometry/Circle",
  "esri/symbols/SimpleFillSymbol", "esri/units",
  "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol",
  "esri/tasks/locator", "esri/InfoTemplate", "dojo/_base/array",
  "esri/symbols/Font", "esri/symbols/TextSymbol", "esri/SpatialReference", "dojo/domReady!"
],
function (Map, SimpleMarkerSymbol, Graphic, Color, Point, Circle,
  SimpleFillSymbol, units, GraphicsLayer, SimpleLineSymbol, Locator,
  InfoTemplate, arrayUtils, Font, TextSymbol, SpatialReference) {

  locate = function (addressString, book, type, callback) {
    var address = {
      "SingleLine": addressString + ' USA'
    };

    locator.outSpatialReference = new SpatialReference({
      wkid: 4326
    });

    locator.addressToLocations({
      address: address,
      outFields: ["Loc_name"]
    });

    bookTitle = book;
    mapMode = type;
    cb = callback;
  }

  launchMap = function (evt) {
    var found = false;

    arrayUtils.every(evt.addresses, function (candidate) {
      // The stronger the score, the more accurate the result
      if (candidate.score > 80) {
        found = true;

        if (mapMode === 'buy') {
          $('#container-map').html('');
          $('#btn-buy-back').css('display', 'block');
          map = new Map("container-map", {
              center: [candidate.location.x, candidate.location.y],
              zoom: 12,
              basemap: "streets"
          });

          var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([115, 224, 142]), 2), new Color([255, 255, 0, 0.25]));
          gl = new GraphicsLayer({
              id: "circles"
          });
          map.addLayer(gl);

          localX = candidate.location.x,
          localY = candidate.location.y;
          circle = new Circle({
              center: new Point(localX, localY),
              geodesic: true,
              radius: 8000,
              radiusUnits: units.MILES
          });

          gl.add(new Graphic(circle, symbol));

          addPoint = function (ad) {
            if (ad.lng && ad.lat) {
              var r = Math.floor(Math.random() * 256),
                  g = Math.floor(Math.random() * 256),
                  b = Math.floor(Math.random() * 256),
                  markerSymbol = new SimpleMarkerSymbol();

              markerSymbol.setPath("M25.754,4.626c-0.233-0.161-0.536-0.198-0.802-0." +
                  "097L12.16,9.409c-0.557,0.213-1.253,0.316-1.968,0.316c-0.997,0.002-2." +
                  "029-0.202-2.747-0.48C7.188,9.148,6.972,9.04,6.821,8.943c0.056-0.024," +
                  "0.12-0.05,0.193-0.075L18.648,4.43l1.733,0.654V3.172c0-0.284-0.14-0.5" +
                  "54-0.374-0.714c-0.233-0.161-0.538-0.198-0.802-0.097L6.414,7.241c-0.3" +
                  "95,0.142-0.732,0.312-1.02,0.564C5.111,8.049,4.868,8.45,4.872,8.896c0" +
                  ",0.012,0.004,0.031,0.004,0.031v17.186c0,0.008-0.003,0.015-0.003,0.02" +
                  "1c0,0.006,0.003,0.01,0.003,0.016v0.017h0.002c0.028,0.601,0.371,0.983" +
                  ",0.699,1.255c1.034,0.803,2.769,1.252,4.614,1.274c0.874,0,1.761-0.116" +
                  ",2.583-0.427l12.796-4.881c0.337-0.128,0.558-0.448,0.558-0.809V5.341C" +
                  "26.128,5.057,25.988,4.787,25.754,4.626zM5.672,11.736c0.035,0.086,0.0" +
                  "64,0.176,0.069,0.273l0.004,0.054c0.016,0.264,0.13,0.406,0.363,0.611c" +
                  "0.783,0.626,2.382,1.08,4.083,1.093c0.669,0,1.326-0.083,1.931-0.264v1" +
                  ".791c-0.647,0.143-1.301,0.206-1.942,0.206c-1.674-0.026-3.266-0.353-4" +
                  ".509-1.053V11.736zM10.181,24.588c-1.674-0.028-3.266-0.354-4.508-1.05" +
                  "5v-2.712c0.035,0.086,0.065,0.176,0.07,0.275l0.002,0.053c0.018,0.267," +
                  "0.13,0.408,0.364,0.613c0.783,0.625,2.381,1.079,4.083,1.091c0.67,0,1." +
                  "327-0.082,1.932-0.262v1.789C11.476,24.525,10.821,24.588,10.181,24.588z");
              markerSymbol.setSize(20);
              markerSymbol.setColor(new Color([r, g, b]));

              var graphic = new Graphic(new Point(ad.lat, ad.lng), markerSymbol);

              map.graphics.add(graphic);

              books[[r, g, b].join(', ')] = ad;

              return graphic;
            }
          };

          map.on('load', function () {
            map.graphics.on('graphic-draw', function (evt) {
              for (var _key in books) {
                (function (key) {
                  $('path[fill="rgb(' + key + ')"]').unbind('click').bind('click', function () {
                    $('#modal-advertisement .modal-title').html(books[key].title + ' ($' + books[key].price + ')');
                    $('#modal-advertisement .container-description').html(books[key].description);
                    $('#modal-advertisement #btn-message').attr('href', 'mailto:' + books[key].email);
                    $('#modal-advertisement').modal();
                  });
                })(_key);
              }
            });

            locator.locationToAddress(candidate.location, 100);

          });
        } else {
          localX = candidate.location.x;
          localY = candidate.location.y;
          locator.locationToAddress(candidate.location, 100);
        }

        return false;
      }
    });

    if (!found) {
      alert('Please ensure that your postal code is correct.');
    }
  }

  launchSocial = function (evt) {
    if (mapMode === 'chat') {
      locat = evt.address.address.City;
      $.get('/book', {
        title: bookTitle
      }, function (data) {
        bookId = data.id;
        bookAuthor = data.author;

        $.get('/message', {
          title: bookTitle,
          location: evt.address.address.City
        }, function (data) {
          var messages = data.messages,
              len = 0;

          if (typeof messages !== 'undefined') {
            len = messages.length;
          }

          if (len > 0) {
            var str = '<div class="well well-darker btn-view" style="float: right" data-view="chat">Go Back</div><div id="well-board-posts"><div class="well well-darker"><h2>' + bookTitle + '</h2><h3>By ' + bookAuthor + '</h3></div>';
            for (var i = 0; i < len; ++i) {
              str += '<div class="well well-darker"><div style="margin-right: 16px; vertical-align: top; display: inline-block"><img src="http://www.gravatar.com/avatar/' + messages[i].FB_id + '?r=PG&s=64&default=identicon" /></div>' + messages[i].content + '</div>';
            }

            str += '</div><div id="btn-post" class="well well-darker" style="float: right">Post a Discussion</div><div class="spacer-60"></div>';

            $('#well-board').html(str);
            $('#well-board .btn-view').click(function () {
              renderView($(this).attr('data-view'));
            });
            $('#well-board #btn-post').click(function () {
              $('#modal-post').modal();
            });
            renderView('social');
          }
        });
      });
    } else if (mapMode === 'buy') {
      $.get('/ad', {
        title: bookTitle,
        location: evt.address.address.City,
        status: 'sell',
      }, function (data) {
        var ads = data.ads;

        if (typeof ads === 'undefined' || ads.length === 0) {
          alert('This book does not appear to be on sale.');
          location.reload();
        } else {
          for (var i = 0; i < ads.length; ++i) {
            var ad = ads[i];
            ad.title = bookTitle;
            addPoint(ad);
          }
        }
      });
    } else {
      locat = evt.address.address.City;
      if (typeof cb === 'function') {
        cb();
      }
    }
  }

  locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
  locator.on("address-to-locations-complete", launchMap);
  locator.on("location-to-address-complete", launchSocial);
});
