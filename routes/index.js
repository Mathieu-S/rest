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
        console.log('wweeeeee');    
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

router.post("/ajoutDiagnostic" ,function(req, res, next) {
    var db = req.db;
    var id = req.query.id;
    var data = req.body.data;
    id = "5704b24ca6307f34e6f418b5";
    checkApi(req, res, db, function() {
        if (id == undefined) {
            res.status(401).json({"undefinedId":"undefinedId"});
            return;
        }
        if (data == undefined) {
            res.status(401).json({"undefinedData":"undefinedData"});
            return;
        }
        
        var visites = db.get("visite");
        var diagnostics = [{"note" : "A", "categorie" : "amiante"}];
        visites.update({"_id" : id}, diagnostics, {}, function(e, doc) {
            res.json(doc);    
        });
    });
});

module.exports = router;