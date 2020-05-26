const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.uploadImage = (req, res) => {
    const imageData = req.body.image.split('base64,')[1];

    const urlPath = '/images/rentals/';
    const uploadPath = './public' + urlPath;
    const fileName = uuidv4()+'.png';

    fs.writeFile(uploadPath+fileName, imageData,'base64', function(err){
        if(err){
            return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}]});
        }
        return res.json({'imageUrl': urlPath+fileName});
    })
}