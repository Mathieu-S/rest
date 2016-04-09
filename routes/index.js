var express = require('express');
var router = express.Router();

function checkApi(req, res, db, next) {
    var apikey = req.query.apikey;
    
    if (apikey == undefined) {
        res.status(400).json({"error":"Please provide valid API key"});
        return;
    }
    
    var keyDb = db.get('user');
    keyDb.findOne({"cle": apikey}, {}, function(e, doc) {
        console.log(doc);
        if(doc == undefined) {
            res.status(418).json({"nope":"nope"});
        } else {
            next();
        }
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.end("youpi")
});

router.get("/getVisitesJour", function(req, res, next) {
    var db = req.db;
    checkApi(req,res,db,function() {
        var collection = db.get('visite');
        
        var rowDate = new Date();
        var jour = rowDate.getDate();
        var mois = rowDate.getMonth() + 1 ;
        if (jour < 10) {
            jour = "0" + jour;
        }
        if (mois < 10) {
            mois = "0" + mois;
        }
        
        var date = jour + "-" + mois + "-" + rowDate.getFullYear();
        collection.find({"dateVisite" : date}, {}, function(e, doc) {
        res.json(doc); 
        });
    });
});
router.get("/getVisitesById", function(req, res, next) {
    var db = req.db;
    var id = req.query.id;
    
    checkApi(req, res, db, function() {
        if (id == undefined) {
            res.status(401).json({"undefinedId":"undefinedId"});
            return;
        }
        
        try {
            var visites = db.get("visite");
            visites.findById(id, {}, function(e, doc) {
                res.json(doc);
            })
        } catch (e) {
            res.status(401).json({"VTFF": "ton id est pourri kiwi"});
        }
    });
});

router.post("/ajoutDiagnostic" ,function(req, res, next) {
    var db = req.db;
    var id = req.query.id;
    var data = req.body.data;
    checkApi(req, res, db, function() {
        if (id == undefined) {
            res.status(401).json({"undefinedId":"undefinedId"});
            return;
        }
        if (data == undefined) {
            res.status(401).json({"undefinedData":"undefinedData"});
            return;
        }
        
        try {
            var visites = db.get("visite");
            visites.findById(id, {}, function(e, doc) {
                var maVisiteDavant = doc;
                var diagnosticData = {"note" : "A", "categorie" : "amiante"};
                maVisiteDavant.diagnostics.push(diagnosticData);
                visites.updateById(id, maVisiteDavant, {}, function(e, doc) {
                    res.json(doc);
                });
            });
        } catch (e) {
            res.status(401).json({"VTFF": "ton id est pourri kiwi"});
        }
    });
});

module.exports = router;