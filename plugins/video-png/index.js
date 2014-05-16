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

          fs.writeFile('image1.png', images[0], function(err){
            if (err) throw err;
            console.log('It\'s saved! 1');

          });
          fs.writeFile('image2.png', images[1], function(err){
            if (err) throw err;
            console.log('It\'s saved! 2');

          });
          fs.writeFile('image3.png', images[2], function(err){
            if (err) throw err;
            console.log('It\'s saved! 3');

          });

    }); 
};

module.exports = video;
