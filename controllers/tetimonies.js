const {Testimony} = require("../models");

const createTestimony = async(req , res , next) =>{
    try{
        const {name , content} = req.body;
        const image = req.file.filename
        if(!name || name.length < 1){
            return res.status(404).
            json({error:"The field 'name' is required on the request params." ,
            param:"name",
            location:"body" })
        }
        if(!content || content.length < 1){
            return res.status(404).
            json({error:"The field 'content' is required on the request params." ,
            param: "content",
            location: "body" }) ;
        }
        const testimonyCreate = await Testimony.create({
            name,
            content,
            image,
        });
        return res.status(200).send(testimonyCreate);
    }catch(error){
        next(error);
        console.log(error);
        return res.status(500).json({ msg: "internal server error", ok: false });
    }
}

const modifyTestimony = async(req , res , next) =>{
    try{
        const {id} = req.params;
        const {name , content} = req.body;
        let image // variable que va tener la imagen si hay en req.file
        if(req.file){
            image = req.file.filename
        }
        const allTestimonies = await Testimony.findAll()
        const idTestimony = allTestimonies.find(el => el.id.toString() === id);
        if(idTestimony){
            idTestimony.name = name ? name : idTestimony.name;
            idTestimony.content = content ? content : idTestimony.content;
            idTestimony.image = image ? image : idTestimony.image;
            return res.status(200).send(idTestimony);
        }
        return res.status(404).json({ error: "no se encuntra ese id" });
    }catch(error){
        next(error);
        console.log(error);
        return res.status(500).json({ msg: "internal server error", ok: false })
    }
}

module.exports = {createTestimony , modifyTestimony } ; 