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
    await mongoClient.connect();
    let Users = mongoClient.db('Project_dp').collection('Users');
        try{
            return await Users.findOne(User);
            
        }
        catch(e){
            console.log('error in find User');
            return null;
        }finally{
            await mongoClient.close();
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
            return await Users.findOne({'UserName':username});
            
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

async function FindItem(Item){
    try{
    await mongoClient.connect();
    let Items = mongoClient.db('Project_dp').collection('Items');
        try{
            let ret=await Items.find( { $text: { $search: Item } } ).toArray();
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


async function updateByUsername(mongoClient,userName,updatedListing){
await mongoClient.db('Project_dp').collection('Users').updateOne({'UserName':userName},{$set: updatedListing});
}


async function addToCart(User,product){
    await mongoClient.connect();
    let Users = mongoClient.db('Project_dp').collection('Users');
    let foundUser=await FindUser1(User);
    let userCart=foundUser.cart;
    userCart.push(product);
    console.log(userCart);
    try {
        updateByUsername(mongoClient,User.UserName,{'cart':userCart})
    }
    catch(e){
        console.error(e);
    }


}

app.post('/login',async function(req,res){
    userSession=req.session;
    let UserName = req.body.username;
    let Password = req.body.password;
    let User ={'UserName':UserName,'Password':Password}; 
    let ret =await FindUser(User);
    if(ret.length == 0){
        alert("your userName or password is not correct");
        res.render('login',{title:'Login'});
    }
    else{
        userSession.username=UserName;
        userSession.pass=Password;
        res.redirect('home');

    }
         

});


/// registration post
app.post('/register',async function(req,res){
    let UserName = req.body.username;
    let Password = req.body.password;
    let cart=new Array;
    let User ={'UserName':UserName,'Password':Password, 'cart':cart}; 
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


app.get('/cart',async function(req, res){
    userSession=req.session;
    let foundUser=await FindUserByUsername(userSession.username);
    let userCart=foundUser.cart;
    console.log(userCart);
        
 
 
    res.render('cart',{myCart:userCart});
});


app.get('/galaxy',function(req, res){
    res.render('galaxy');
});

app.get('/home',function(req, res){
    res.render('home');
    console.log(userSession.username);
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


    pp.post('/search',async function(req,res){
        var x=await FindItem(req.body.Search);
        if(x==null){
            alert("You don't have a connection");
        }
        else 
        res.render('searchresults',{list:x});
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


app.post("/cartIphone",function(req,res){
userSession=req.session;
let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
addToCart(loggedUser,"iphone");

});

app.post("/cartGalaxy",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"galaxy");
    
    });

app.post("/cartSun",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"sun");
        
    });

app.post("/cartTennis",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"tennis");
            
});
            
            

app.post("/cartLeaves",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"leaves");
                
});




app.post("/cartBoxing",function(req,res){
    userSession=req.session;
    let loggedUser={"UserName":userSession.username,"Password":userSession.pass}
    addToCart(loggedUser,"boxing");
                    
});






app.listen(3000);

  


