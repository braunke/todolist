var express = require('express');
var router = express.Router();

/* GET home page, a list of incomplete tasks . */
router.get('/', function(req, res, next) {

    req.task_col.find({completed:false}).toArray(function(err, tasks){
        if (err) {
            return next(err);
        }
        res.render('index', { title: 'TODO list' , tasks: tasks });
    });
});
/* POST Add new task, then redirect to task list */
router.post('/add', function(req, res, next){

    if (!req.body || !req.body.text) {
        //error message for user
        req.flash('error', 'Please enter some text');
        res.redirect('/');
    }

    else {
        // Save new task with text provided, and completed = false
        var task = { text : req.body.text, completed: false};

        req.task_col.insertOne(task, function(err, task) {
            if (err) {
                return next(err);
            }
            res.redirect('/')
        })
    }

});


module.exports = router;
