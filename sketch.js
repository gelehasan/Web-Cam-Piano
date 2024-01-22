
var video;
//My code starts here
var prevImg;
var grid;
//Ends here
var diffImg;
var currImg;
var thresholdSlider;
var threshold;

function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
// Captures video from the webcam
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);
// Initialize a grid for processing
    grid = new Grid(640,480);
}

function draw() {
    background(0);
     //Displays the video stream
    image(video, 0, 0);

     // Creates a current image from the video stream
    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
   
    //My code starts here
    // Resize and apply blur to the current image
    currImg.resize(currImg.width / 4, currImg.height/4); 
    currImg.filter(BLUR,3)
    //ends here

    // Creates an image for difference comparison
    diffImg = createImage(video.width, video.height);
    //My code starts here
    diffImg.resize(diffImg.width / 4,diffImg.height / 4 );
    //Ends here 
    diffImg.loadPixels();

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    
    diffImg.updatePixels();
   // Displays the difference image
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);

    //My code starts here
    //i moved this code from keyPressed 
    //updates the previous image for comparison
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);

    // Run the grid processing on the difference image
    grid.run(diffImg);
    //ends here
}


