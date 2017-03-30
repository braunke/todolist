var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID
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
//adds done button
router.post('/done', function(req, res, next){

    req.task_col.updateOne({ _id : ObjectID(req.body._id) }, {$set : { completed : true }}, function(err, result) {

        if (err) {
            return next(err);    // For database errors, 500 error
        }

        if (result.result.n == 0) {
            var req_err = new Error('Task not found');
            req_err.status = 404;
            return next(req_err);     // Task not found error
        }
        req.flash('info', 'Marked as completed');
        return res.redirect('/')
    })
    });


module.exports = router;
