var express = require('express');
var path = require('path');
var app = express();
var fs= require('fs');
var {MongoClient} = require('mongodb');
var uri = 'mongodb+srv://admin:admin@cluster0.mxtmt.mongodb.net/cluster0?retryWrites=true&w=majority';
var mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var alert = require('alert');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));




//// login bage

/// add user function
async function addUser(User){
    try{
        await mongoClient.connect();
        let Users = mongoClient.db('Project_dp').collection('Users');
        try{
           await Users.insertOne(User);
        }catch(e){
           console.log('error in the insert the User');
        }
    }
    catch(e){
        console.log("error is happened");
    }
}

async function FindUser(User){
    try{
    await mongoClient.connect();
    let Users = mongoClient.db('Project_dp').collection('Users');
        try{
            let ret=await Users.find(User).toArray();
            return ret;
        }
        catch(e){
            console.log('error in find User');
            return null;
        }
   }
   catch(e){
       console.log("error in the Connection of FindUser");
       return null;
   }
}

app.post('/login',async function(req,res){
    let UserName = req.body.username;
    let Password = req.body.password;
    let User ={'UserName':UserName,'Password':Password}; 
    let ret =await FindUser(User);
    if(ret.length == 0){
        alert("your userName or password is not correct");
        res.render('login',{title:'Login'});
    }
    else
        res.redirect('home');
});


/// registration post
app.post('/register',async function(req,res){
    let UserName = req.body.username;
    let Password = req.body.password;
    let User ={'UserName':UserName,'Password':Password}; 
    let testUsed = {'UserName':UserName};
    let ret =await FindUser(testUsed);
    if(ret!= null && ret.length == 0){
        addUser(User);
        res.redirect('login');  
    }
    else {
        alert("The UserName is already exist");
        res.render('registration'); 
    }
});


app.get('/',function(req, res){
   res.render('login', {title: "Login"});
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


app.listen(3000);

  


