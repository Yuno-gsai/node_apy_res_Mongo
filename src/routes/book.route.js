const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

const getBook = async (req,res,next) =>{
    let book
    const {id} = req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(400).json({message: 'Invalid book id'});
    }
    try{
        book = await Book.findById(id);
        if(book === null){
            return res.status(404).json({message: 'Book not found'});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }
    res.book = book;
    next();
}

router.get('/', async (req,res)=>{
    try{
        const books = await Book.find();
        console.log('Get all ',books);
        if(books.length === 0){
            return res.status(204).json([]);
        }
        res.json(books);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/', async(req,res)=>{
    const {title,author,genere,publicationDate,} = req.body;
    if(!title || !author || !genere || !publicationDate){
        return res.status(400).json({message: 'All fields are required'});
    }
    const book = new Book({
        title,
        author,
        genere,
        publicationDate,
    });
    try{
        const newBook = await book.save();
        console.log('New book created ',newBook);
        res.status(201).json(newBook);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

router.get('/:id', getBook, (req,res)=>{
    res.json(res.book);
});

router.put('/:id',getBook, async (req,res)=>{
    try{
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genere = req.body.genere || book.genere;
        book.publicationDate = req.body.publicationDate || book.publicationDate;
        const updatedBook = await book.save();
        res.json(updatedBook);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

router.patch('/:id',getBook, async (req,res)=>{
    if(!req.body.title && !req.body.author && !req.body.genere && !req.body.publicationDate){
        res.status(400).json({message: 'At least one field is required'});
    }
    try{
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genere = req.body.genere || book.genere;
        book.publicationDate = req.body.publicationDate || book.publicationDate;
        const updatedBook = await book.save();
        res.json(updatedBook);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id',getBook, async (req,res)=>{
    try{
        await res.book.deleteOne({
            _id: res.book._id
        });
        res.json({message: 'Book deleted'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

module.exports = router;