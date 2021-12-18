var express = require('express');
var path = require('path');
var app = express();
var fs= require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/',function(req, res){
res.render('login', {title: "express"})
});


//whenever you get a request for the page 'books' excute function
app.get('/books',function(req, res){
    res.render('books');
    });

app.get('/boxing',function(req, res){
    res.render('boxing');
    });


app.get('/cart',function(req, res){
    res.render('cart');
    });


app.get('/galaxy',function(req, res){
    res.render('galaxy');
    });

app.get('/home',function(req, res){
    res.render('home');
    });


app.get('/iphone',function(req, res){
    res.render('iphone');
    });

app.get('/leaves',function(req, res){
    res.render('leaves');
    });  


app.get('/login',function(req, res){
    res.render('login');
    });

app.get('/phones',function(req, res){
    res.render('phones');
    });


app.get('/registration',function(req, res){
    res.render('registration');
    });


app.get('/searchresults',function(req, res){
    res.render('searchresults');
    });


app.get('/sports',function(req, res){
    res.render('sports');
    });

app.get('/sun',function(req, res){
    res.render('sun');
    });
    
    
app.get('/tennis',function(req, res){
    res.render('tennis');
    });

app.post('/search',function(req,res){
var x=req.body.Search;
console.log(x);
res.render('searchresults');
});

app.post('/',function(req,res){
var x=req.body.username;
console.log(x);
res.render('home');
});

app.listen(3000);

  


