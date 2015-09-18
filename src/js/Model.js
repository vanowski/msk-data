'use strict';

class Model extends Backbone.Model {
    get colors() {
        return {
            center: 'rgb(223, 128, 12)',
            periphery: 'rgb(0, 148, 222)',
            outline: 'rgb(11, 0, 0)'
        }
    }

    initialize() {
        let data = this.get('data');
        let centerData = [];
        let peripheryData = [];
        let occurrenceMap = {};
        let maxOccurrence = 1;

        data.forEach((datum) => {
            let dateString = datum.date.toDateString();
            let dateOccurrence = occurrenceMap[dateString];

            if (dateOccurrence) {
                occurrenceMap[dateString]++;
            } else {
                occurrenceMap[dateString] = 1;
            }

            if (dateOccurrence > maxOccurrence) {
                maxOccurrence = dateOccurrence;
            }

            if (datum.center) {
                centerData.push(datum);
            } else {
                peripheryData.push(datum);
            }
        });

        this.set({
            originalData: data,
            centerData: centerData,
            peripheryData: peripheryData,
            maxOccurrence: maxOccurrence,
            occurrenceMap: occurrenceMap,
            earliestRecord: this.get('data').reduce((a, b) => (a.date <= b.date ? a : b)),
            latestRecord: this.get('data').reduce((a, b) => (a.date >= b.date ? a : b))
        });
    }
}