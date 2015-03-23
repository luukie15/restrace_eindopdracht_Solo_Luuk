var express = require('express');
var router = express();
var _ = require('underscore');

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = function (mongoose, errCallback) {
    console.log('Initializing racers routing module');
    var Race = mongoose.model('Race');
    var handleError = errCallback;
    
    function getUserRole(req, res) {
        var role = "";
        if (isLoggedIn && typeof req.user !== 'undefined') {
            role = req.user.local.role;
        } else {
            role = "geen rol";
        }
        return role;
    }

    function getRace(req, res) {
        var raceId = req.params.id;
        var race = Race.find({_id: raceId});
        race.exec(function (err, data) {
            if (err) {
                return handleError(req, res, 500, err);
            }
            var role = getUserRole(req, res);
            console.log(role);
            res.render('show_race', {data: data, role: role});
        });
    }

    router.route('/')
            
            .get(function (req, res, next) {
                var role = getUserRole(req, res);
                res.render('races_home', {role: role});
            });
    router.route('/:id')
            .get(getRace);
    return router;
};


/**
 * 
/Races
HTMl

API/RACES
JSON

Api/Races [   ::GET
    { name: race 1, etc... }
]

Api/Races/2    ::GET
{ id: 2, name : race2, etc}

Api/Races    ::POST
{    name: new Race, etc...  }

API/RACES/2 ::PUT
{ name: new Race, etc...}

xample:  GetRace( Req.url.id ).update(req.body.race);

API/RACES/2 ::DELTE
{ EMPTY }

########## TOEVEOGEN VAN EEN WAYPOINT ###############
API/RACES/2/WAYPTOINS   ::POST
{ waypointName: 'weej pointje', etc. }


--> ShowRace 
--> GetRAce


**/