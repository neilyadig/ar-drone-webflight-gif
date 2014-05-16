function video(name, deps) {
    
    var latestImage;
    var images = [];
    var fs = require('fs');

    // Add a new route to fetch camera image
    deps.app.get('/camera/:id', function(req, res) {
      if (!latestImage) {
          res.writeHead(301, {"Location": "/plugin/" + name + "/images/nofeed.jpg"});
          res.end();
          return;
      }
      
      res.writeHead(200, {'Content-Type': 'image/png'});
      return res.end(latestImage, "binary");
    });

    // Add a handler on images update
    deps.client.getPngStream()
      .on('error', console.log)
      .on('data', function(frame) { 
        latestImage = frame;

        images.push(frame);
        while (images.length > 10) {
        images.shift();

      }

          fs.writeFile('png/image1.png', images[0], function(err){
            if (err) throw err;
            console.log('It\'s saved! 1');

          });
          fs.writeFile('png/image2.png', images[1], function(err){
            if (err) throw err;
            console.log('It\'s saved! 2');

          });
          fs.writeFile('png/image3.png', images[2], function(err){
            if (err) throw err;
            console.log('It\'s saved! 3');

          });
          fs.writeFile('png/image4.png', images[3], function(err){
            if (err) throw err;
            console.log('It\'s saved! 4');

          });
          fs.writeFile('png/image5.png', images[4], function(err){
            if (err) throw err;
            console.log('It\'s saved! 5');

          });
          fs.writeFile('png/image6.png', images[5], function(err){
            if (err) throw err;
            console.log('It\'s saved! 6');

          });
           fs.writeFile('png/image7.png', images[6], function(err){
            if (err) throw err;
            console.log('It\'s saved! 7');

          });
           fs.writeFile('png/image8.png', images[7], function(err){
            if (err) throw err;
            console.log('It\'s saved! 7');

          });
          fs.writeFile('png/image9.png', images[8], function(err){
            if (err) throw err;
            console.log('It\'s saved! 9');

          });
          fs.writeFile('png/image10.png', images[9], function(err){
            if (err) throw err;
            console.log('It\'s saved! 10');

          });

    }); 
};

module.exports = video;
