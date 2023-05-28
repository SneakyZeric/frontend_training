const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    books = [
        {name:'xxx', pages: 10},
        {name:'aaa', pages: 120},
        {name:'bbb', pages: 320}
    ],
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

app.use(bodyParser.json());
app.listen(8080, function(){
    console.log('server connected!');
})
mongoose.Promise = Promise;
// connect to mongodb
mongoose.connect('mongodb://localhost/bkdb')
    .then(function(){
        console.log('Connected to MongoDB!');
    })
    .catch(function(error){
        console.log(error.message);
    });


const bookSchema = new Schema({
    id: {type: String, unique: true, required:true},
    name: String,
    page: Number,
    isbn: String,
    price: {type: Number, min: Number.MIN_VALUE, required:true}
},{collection: 'books'}),
    Book = mongoose.model('Book', bookSchema);

function fakeAuth(req, res, next){
    if(Math.random() > 0.5){
        res.send('<h1>Auth failed</h1>');
    }
    else{
        next();
    }
}

app.get('/bookstore', function getBooks(req, res, next){
    console.log('get all books');
    Book.find({})
        .then(function(doc){
            res.send(doc);
        })
        .catch(function(err){
            re.send(err.message);
        });
});

app.get('/bookstore/:id', function getOneBookById(req, res, next){
    var id = req.params.id;
    console.log('get book by id');
    Book.find({id:id})
        .then((doc)=>{
            if (doc.length == 0){
                res.send({success: false, message: "Can't find book with id: " + id});
            }else{
                res.send(doc);
            }
        })
       .catch(function(err){
           res.send(err.message);
       });
});

app.post('/bookstore', function postBook(req, res, next){
    var book = new Book(req.body);
    console.log('post a book')
    book.save()
        .then(function(doc){
            res.send(doc);
        })
        .catch(function(err){
            res.send({success: false, message: err.message});
        });

});

app.delete('/bookstore/:id', function deleteByBookname(req, res, next){
    var id = req.params.id;
    console.log("deleting book by id:", id);
    Book.deleteOne({id:id})
        .then((doc)=>{
            if (doc.deletedCount == 0){
                res.send({success: false, message: "Can't find book with id: " + id});
            }else{
                res.send(doc);
            }
        })
        .catch((err)=>{
            res.send({success: false, message: err.message});
        });
});

app.put('/bookstore/:id', function updateBook(req, res, next){
    var id = req.params.id;
    console.log("updating book by id:", id);
    Book.findOneAndUpdate({id:id},req.body,{new:true})
        // Book.updateOne({id:id},req.body)
        .then((doc)=>{
            // res.send(doc);
            res.send(req.body);
        })
        .catch((err)=>{
            res.send({success: false, message: err.message});
        });

});