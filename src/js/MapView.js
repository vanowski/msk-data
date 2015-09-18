'use strict';

const CIRCLE = {
    RADIUS_BIG: 10,
    RADIUS_SMALL: 1,
    RADIUS_NORMAL: 3
};
const DURATION = 400;

class MapView extends Backbone.View {
    initialize() {
        // Sorry for this little weird part, it's Google Maps API, not me
        // @see https://developers.google.com/maps/documentation/javascript/customoverlays
        let view = this;

        this.overlay = Object.assign(new google.maps.OverlayView(), {
            onAdd: function() {
                this.container = d3.select(this.getPanes().overlayLayer)
                    .append('div').attr('class', 'overlay');
            },
            draw: function() {
                let projection = this.getProjection();

                let markers = this.container.selectAll('svg')
                    .data(view.model.get('data'));

                markers.each(translate)
                    .enter()
                    .append('svg:svg')
                    .attr('class', 'marker')
                    .each(translate)
                    .append('svg:circle')
                    .style('fill', (d) => d.center ? view.model.colors.center : view.model.colors.periphery)
                    .attr('cx', CIRCLE.RADIUS_BIG)
                    .attr('cy', CIRCLE.RADIUS_BIG)
                    .attr('r', CIRCLE.RADIUS_SMALL)
                    .transition()
                    .duration(DURATION)
                    .attr('r', CIRCLE.RADIUS_BIG)
                    .transition()
                    .duration(DURATION)
                    .attr('r', CIRCLE.RADIUS_NORMAL);

                markers.exit().remove();

                function translate(d) {
                    let mapCoords = new google.maps.LatLng(d.lat, d.lng);
                    let pixelCoords = projection.fromLatLngToDivPixel(mapCoords);

                    return d3.select(this)
                        .style('left', pixelCoords.x + 'px')
                        .style('top', pixelCoords.y + 'px');
                }
            }
        });

        if (this.model.get('data') && this.model.get('map')) {
            this.render();
        }

        this.model.on('change:data', () => {
            this.overlay.draw();
        });
    }

    render() {
        this.overlay.setMap(this.model.get('map'));
    }
}