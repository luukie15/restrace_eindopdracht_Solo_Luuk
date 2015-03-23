function init(mongoose) {
    console.log('Initializing race schema');

    var raceSchema = mongoose.Schema({
        name: {type: String, required: true},
        status: {type: String, required: true, default: "pending"},
        users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' /* Pseudo-joins */}],
        waypoints: [{type: mongoose.Schema.Types.ObjectId, ref: 'Waypoint' /* Pseudo-joins */}]

    },
    // settings:
    {
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
    });

    // validation
    raceSchema.path('name').validate(function (val) {
        return val && val.length <= 10;
    }, 'racename cannot be longer than 10 characters');

    // filters
    raceSchema.statics.filterOnName = function (result, name) {
        if (!result) {
            result = this.find();
        }

        return result.where('name', name);
    };

    //paging
    raceSchema.statics.findByPage = function (result, pageIndex, pageSize) {
        if (!result) {
            result = this.find();
        }

        return result
                .limit(pageSize)
                .skip(pageIndex * pageSize)
    };


    mongoose.model('Race', raceSchema);
}

module.exports = init;