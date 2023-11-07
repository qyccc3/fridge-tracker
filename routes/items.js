import express from 'express';
import DatabaseManager from '../db.js';

let router = express.Router();

router.get('/getAllItems', async (req, res) => {
    let db = DatabaseManager.getInstance();
    let items = await db.getAllItems();
    return res.json(items);
});

router.post('/addItem', async (req, res) => {
    let db = DatabaseManager.getInstance();
    let item = await db.searchItem(req.body.name);
    if (item.length > 0){
        // parse item.count to int
        item = await db.changeItem(req.body.name,  parseInt(item[0].count) + parseInt(req.body.count));
        return res.json(item);
    }
    item = await db.addItem(req.body.name, req.body.count, req.body.type, req.body.date);
    return res.json(null);
});

router.post('/addCategory', async (req, res) => {
    let db = DatabaseManager.getInstance();
    let category = await db.getCategory(req.body.name);
    if (category.length > 0){
        return res.json(category);
    }
    category = await db.addCategory(req.body.name);
    return res.json(null);
})

router.post('/changeItem', async (req, res) => {
    let db = DatabaseManager.getInstance();
    let item = await db.changeItem(req.body.name, req.body.count);
    if(req.body.count == 0){
        await db.deleteItem(req.body.name);
    }
    return res.json(item);
});

router.get('/getAllCategories', async (req, res) => {
    let db = DatabaseManager.getInstance();
    let categories = await db.getAllCategories();
    return res.json(categories);
})

export default router;
