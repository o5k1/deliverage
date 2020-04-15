getMap = function () {
  var map = new Microsoft.Maps.Map('#myMap', {
    credentials: 'Ar-9CgCbalbkrLCgfcSeABL5BqV6kp-nYjUpWBEUwTjjzFbWT14ZWT4Wux3L7dZj',
  });

  console.log(map);

  //Add your post map load code here.
  var center = map.getCenter();

  //Create custom Pushpin
  var pin = new Microsoft.Maps.Pushpin(center, {
    title: 'Andrea Tombolato',
    subTitle: 'Via Roncà 36/A, Tombolo (PD)'
  });

  //Add the pushpin to the map
  map.entities.push(pin);
};

$(document).ready(function () {


});