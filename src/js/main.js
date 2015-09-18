'use strict';

const MOSCOW_CENTER = {lat: 55.7467, lng: 37.5369};
const DEFAULT_ZOOM = 11;

$(() => {
    let mapContainer = d3.select('.map');
    let histogram = d3.select('.histogram');
    let dsv = d3.dsv(';', 'text/plain');

    let mapPromise = new Promise(function(resolve, reject) {
        $(document).on('mapLoaded', () => {
            let map = new google.maps.Map(mapContainer.node(), {
                center: MOSCOW_CENTER,
                zoom: DEFAULT_ZOOM
            });

            resolve(map);
        });
    });

    dsv('/tweets', function(row) {
        let dateFormat = d3.time.format('%d.%m.%Y');

        return {
            center: row.center === '1',
            lat: parseFloat(row.lat.replace(',', '.')),
            lng: parseFloat(row.long.replace(',', '.')),
            date: dateFormat.parse(row.date)
        }
    }, function(error, data) {
        if (error) {
            throw error;
        }

        mapPromise.then(function(map) {
            let model = new Model({
                data: data,
                map: map
            });

            let mapView = new MapView({
                model: model,
                el: mapContainer.node()
            });

            let histogramView = new HistogramView({
                model: model,
                el: histogram.node()
            });
        });
    });
});