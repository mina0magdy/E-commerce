var express = require('express');
var path = require('path');
var app = express();
var fs= require('fs');
var {MongoClient} = require('mongodb');
var uri = 'mongodb+srv://admin:admin@cluster0.mxtmt.mongodb.net/cluster0?retryWrites=true&w=majority';
var mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const session=require("express-session");
app.use(session({secret:'secret'}));
var alert = require('alert');
const { Script } = require('vm');
const { Console } = require('console');
var isSinged;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


var userSession;

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
        finally{
            await mongoClient.close();
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
        finally{
            await mongoClient.close();
        }
   }
   catch(e){
       console.log("error in the Connection of FindUser");
       return null;
   }
}

async function FindUser1(User){
    try{
    let Users = mongoClient.db('Project_dp').collection('Users');
        try{
            let ret = await Users.findOne(User);
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

async function FindUserByUsername(username){
    try{
    await mongoClient.connect();
    let Users = mongoClient.db('Project_dp').collection('Users');
        try{
            let ret =await Users.findOne({'UserName':username});
            return ret;
        }
        catch(e){
            console.log('error in find User');
            return null;
        }
        finally{
            await mongoClient.close();
        }
   }
   catch(e){
       console.log("error in the Connection of FindUser");
       return null;
   }
}

/// add Items
async function addItems(){
    try{
        await mongoClient.connect();
        let Items = mongoClient.db('Project_dp').collection('Items');
        try{
           await Items.insertMany([{name:'Boxing Bag',url:'/boxing'},{name:'Tennis Racket',url:'/tennis'},{name:'Leaves of Grass',url:'/leaves'},{name:'The Sun and Her Flowers',url:'/sun'},{name:'Galaxy S21 Ultra',url:'/galaxy'},{name:'iPhone 13 Pro',url:'/iphone'}]);
           await Items.createIndex({name:'text'});
        }catch(e){
           console.log('error in the insert the Items');
        }
        finally{
            await mongoClient.close();
        }
    }
    catch(e){
        console.log("error is happened");
    }
}
//// first call the function addItem and we let it be called only once then we comment it;
//addItems();
//console.log("Atems is added");
async function FindItem(Item){
    try{
    await mongoClient.connect();
    let Items = mongoClient.db('Project_dp').collection('Items');
        try{
            let ret=await Items.find({name:{'$regex' : Item, '$options' : 'i'}}).toArray();
            return ret;
        }
        catch(e){
            console.log('error in find Item');
            return null;
        }
        finally{
            await mongoClient.close();
        }
   }
   catch(e){
       console.log("error in the Connection of FindItem");
       return null;
   }
}





async function addToCart(User,product){
    await mongoClient.connect();
    let Users = mongoClient.db('Project_dp').collection('Users');
    let foundUser= FindUser1(User);//comment
    let userCart=foundUser.cart;
    if(userCart.length != 0 && userCart.includes(product)){
        res.send('<script>alert("the product is already in the card");window.location.href = "/cart" ; </script>');
        //console.log("added")

        //alert("the product is already in the card");
        return;
    }
    userCart.push(product);
    console.log(userCart);
    try {
        await mongoClient.db('Project_dp').collection('Users').updateOne({'UserName':User.UserName},{$set: {'cart':userCart}});
        res.send('<script>alert("The Product is added to the Card");window.location.href = "/cart" ; </script>');
        //console.log("erroe")
        //alert("The Product is added to the Card");
        await mongoClient.close();
    }
    catch(e){
        console.error(e);
    }
   
}

app.post('/login',async function(req,res){
    userSession=req.session;
    isSinged=false;
    let UserName = req.body.username;
    let Password = req.body.password;
    if(UserName == null || UserName == ""||Password == null || Password == ""){
        res.send('<script>alert("Please Enter a Valid data"); window.location.href = "/"; </script>');

        //alert("Please Enter a Valid data");
        //res.render('login',{title:'Login'});
        return;
    }
    let User ={'UserName':UserName,'Password':Password}; 
    let ret =await FindUser(User);
    if(ret != null&&ret.length == 0){
        res.send('<script>alert("your userName or password is not correct"); window.location.href = "/"; </script>');

        //alert("your userName or password is not correct");
       // res.render('login',{title:'Login'});
    }
    else{
        userSession.username=UserName;
        userSession.pass=Password;
        isSinged = true;
        res.redirect('home');
    }
         

});


/// registration post
app.post('/register',async function(req,res){
    let UserName = req.body.username;
    let Password = req.body.password;
    let cart=new Array;
    if(UserName == null || UserName == ""||Password == null || Password == ""){
        res.send('<script>alert("Please Enter a Valid data"); window.location.href = "/registration"; </script>');

       // alert("Please Enter a Valid data");
        return;
    }
    let User ={'UserName':UserName,'Password':Password, 'cart':cart}; 
    let testUsed = {'UserName':UserName};
    let ret =await FindUser(testUsed);
    if(ret!= null && ret.length == 0){
        addUser(User);
        //alert("Registeration is completed");
        res.send('<script>alert("Registeration is completed"); window.location.href = "/home"; </script>');
       // res.redirect('home');  
    }
    else {
        res.send('<script>alert("The UserName is already exist"); window.location.href = "/registration"; </script>');
        //alert("The UserName is already exist");
        //res.render('registration'); 
    }
});


app.get('/',function(req, res){
   
   res.render('login', {title: "Login"});
});



//whenever you get a request for the page 'books' excute function
app.get('/books',function(req, res){
  
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('books');
});

app.get('/boxing',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('boxing');
});


app.get('/cart',async function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    userSession=req.session;
    let foundUser=await FindUserByUsername(userSession.username);
    let userCart=foundUser.cart;
    console.log(userCart);
        
 
 
    res.render('cart',{myCart:userCart});
});


app.get('/galaxy',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('galaxy');
});

app.get('/home',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('home');
    console.log(userSession.username);
    });


app.get('/iphone',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('iphone');
    });

app.get('/leaves',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('leaves');
    });  


app.get('/login',function(req, res){
    res.render('login');
    });

app.get('/phones',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('phones');
    });


app.get('/registration',function(req, res){

    res.render('registration');
    });


    app.post('/search',async function(req,res){
        var x=await FindItem(req.body.Search);
        if(x==null){
            alert("You don't have a connection");
        }
        else 
        res.render('searchresults',{list:x});
    });


app.get('/sports',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('sports');
    });

app.get('/sun',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
    res.render('sun');
    });
    
    
app.get('/tennis',function(req, res){
    if(typeof(userSession)=="undefined"){
        res.send('<script>alert("You Have to Login first"); window.location.href = "/"; </script>');

       // alert("You Have to Login first");
        //res.redirect('login');
        return;
    }
   
    res.render('tennis');
    });


app.post("/cartIphone",function(req,res){
userSession=req.session;
let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
addToCart(loggedUser,"iphone");
//res.redirect('cart');

});

app.post("/cartGalaxy",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"galaxy");
    //res.redirect('galaxy');
    
    });

app.post("/cartSun",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"sun");
   // res.redirect('sun');
    });

app.post("/cartTennis",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"tennis");
   // res.redirect('tennis');
});
            
            

app.post("/cartLeaves",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"leaves");
   // res.redirect('leaves');   
});




app.post("/cartBoxing",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"boxing");
   // res.redirect('boxing');        
});






if (process.env.PORT){
    app.listen(process.env.PORT,function(){
        console.log('Server started')
    })
}
else{
    app.listen(3000,process.env.PORT,function(){
        console.log('Server on port 30000')
    })
}
///

  


