const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Schema = mongoose.Schema;

app.listen(8080, ()=>{console.log('Server connected!')});
app.use(bodyParser.json());
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/testDB')
    .then(()=>{
        console.log('mongodb connected');
    })
    .catch((err)=>{
        console.log(err);
    });

const productSchema = new Schema({
    id: {type: String, unique: true, required: true},
    name: String,
    price: {type: Number, required: true, min: Number.MIN_VALUE}
},{collection: 'product'}),
    Product = mongoose.model('Product', productSchema);

app.get('/product', (req, res, next)=>{
    console.log('get all products');
    Product.find({})
        .then((doc)=>{
            res.send(doc);
        })
        .catch((err)=>{
            res.send(err.message);
        });
});

app.post('/product', (req, res, next)=>{
    var product = new Product(req.body);
    console.log('post a new book');
    product.save()
        .then((doc)=>{
            res.send(doc);
        })
        .catch((err)=>{
            res.send(err.message);
        });
});

app.delete('/product/:id', (req, res, next)=>{
    var id = req.params.id;
    console.log('delete a product by id');
    Product.deleteOne({id:id})
        .then((doc)=>{
            if (doc.deletedCount === 0){
                res.send('cant find the book by id: ' + id);
            }else {
                res.send(doc);
            }
        })
        .catch((err)=>{
            res.send(err.message);
        });

});

app.put('/product/:id', (req, res)=>{
   var id = req.params.id,
       product = new Product(req.body);
   console.log('updating book by id: ' + id);
   Product.findOneAndUpdate({id: id}, req.body, {new: true})
       .then((doc)=>{
           res.send(doc);
       })
       .catch((err)=>{
           res.send(err.message);
       });
});

// app.put('/product/:id', function updateBook(req, res, next){
//     var id = req.params.id;
//     console.log("updating book by id:", id);
//     Product.findOneAndUpdate({id:id},req.body,{new:true})
//         // Book.updateOne({id:id},req.body)
//         .then((doc)=>{
//             // res.send(doc);
//             res.send(req.body);
//         })
//         .catch((err)=>{
//             res.send({success: false, message: err.message});
//         });
//
// });