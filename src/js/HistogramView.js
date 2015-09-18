'use strict';

const WIDTH = 400;
const HEIGHT = 300;
const SLIDER_PADDING = 20;
const STROKE = {
    FAT: 5,
    NORMAL: 2
};

class HistogramView extends Backbone.View {
    initialize() {
        if (this.model.get('data')) {
            this.render();
        }
    }

    render() {
        let centerData = this.model.get('centerData');
        let peripheryData = this.model.get('peripheryData');
        let earliestRecord = this.model.get('earliestRecord');
        let latestRecord = this.model.get('latestRecord');
        let maxOccurrence = this.model.get('maxOccurrence');
        let occurrenceMap = this.model.get('occurrenceMap');

        this.widget = d3.select(this.el)
            .append('svg:svg')
            .attr('width', WIDTH)
            .attr('height', HEIGHT);

        let controls = this.widget.append('svg:g');
        let xScale = d3.time.scale().domain([earliestRecord.date, latestRecord.date]).range([0, WIDTH]);

        function drawPath(data, range, color) {
            let yScale = d3.scale.linear().domain([0, maxOccurrence]).range(range);

            let line = d3.svg.area()
                .x((d) => xScale(d.date))
                .y((d) => yScale(occurrenceMap[d.date.toDateString()]))
                .y0(HEIGHT / 2)
                .interpolate('linear');

            let path = controls.append('svg:path')
                .attr('stroke', 'none')
                .attr('fill', color)
                .attr('d', line(data));
        }

        drawPath(centerData, [HEIGHT / 2, 0], this.model.colors.center);
        drawPath(peripheryData, [HEIGHT / 2, HEIGHT], this.model.colors.periphery);

        controls.append('svg:line')
            .transition()
            .attr('x1', 0)
            .attr('y1', HEIGHT / 2)
            .attr('x2', WIDTH)
            .attr('y2', HEIGHT / 2)
            .attr('stroke', this.model.colors.outline)
            .style('stroke-width', STROKE.FAT);

        let viewportScale = xScale;
        let viewport = d3.svg.brush()
            .x(viewportScale)
            .on('brush', function() {
                let originalData = this.model.get('originalData');

                if (viewport.empty()) {
                    this.model.set('data', originalData);
                } else {
                    let extent = viewport.extent();
                    let currentScope = originalData.filter((datum) => {
                        return datum.date >= extent[0] && datum.date <= extent[1];
                    });

                    this.model.set('data', currentScope);
                }
            }.bind(this));

        this.widget.append('svg:g')
            .attr('class', 'viewport')
            .call(viewport)
            .selectAll('rect')
            .attr('height', HEIGHT);
    }
}