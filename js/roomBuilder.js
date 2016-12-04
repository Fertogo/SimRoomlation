var canvas  = new fabric.Canvas('c');
$(document).ready(function(){
   console.log("Ready")
   canvas.setOverlayImage('1022.png', canvas.renderAll.bind(canvas), {
    left: 230,
    top: 10,
    scaleX: 1.5,
    scaleY: 1.5,
    opacity: 1
   });
});

$("img.furniture").load(function(e) {
  console.log(canvas.getObjects().length)
   var image = new fabric.Image(e.target, {
     left: Math.floor(canvas.getObjects().length / 4) * 110,
     top: canvas.getObjects().length * 110 - (Math.floor(canvas.getObjects().length/4)*110*4),
     opacity: 0.85
   })
   canvas.add(image);
   canvas.bringToFront(image);

   // Disable scaling controls
   image.setControlsVisibility({
     bl: false, br: false, mb: false, ml: false, mr: false, mt: false, tl: false, tr: false,
     mtr: true
   })
})

currentX = 0; currentY = 0;
X_OFFSET = 245; Y_OFFSET = 245;
// X_OFFSET = 0; Y_OFFSET = 0;

X_MAX = 1500; Y_MAX = 450

// Keep track of cursor position
$(document).mousemove(function (e) {
    currentX = e.pageX;
    currentY = e.pageY;
});

var selection = "bed";

$("img.furniture").mousedown(function(e){
  selection = e.target
})

// limit object moving to canvas (thanks stack overflow dude)
canvas.on('object:moving', function (e) {
        var obj = e.target;
         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }
        obj.setCoords();
        // top-left  corner
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        // bot-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
});

function handleFileSelect(evt) {

  evt.stopPropagation();
  evt.preventDefault();
  console.log(evt.pageX-X_OFFSET)
  console.log(evt.pageY-Y_OFFSET)

  var image = new fabric.Image(selection, {
    left: evt.pageX-X_OFFSET,
    top: evt.pageY-Y_OFFSET,
    opacity: 0.85,
    lockScalingX: true,
    lockScalingY: true
  })
  canvas.add(image);
  canvas.bringToFront(image);

  // Disable scaling controls
  image.setControlsVisibility({
    bl: false, br: false, mb: false, ml: false, mr: false, mt: false, tl: false, tr: false,
    mtr: true
  })

  $(selection).remove()

}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the drop listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);


function download(url,name){
  // make the link. set the href and download. emulate dom click
  $('<a>').attr({href:url,download:name})[0].click();
}
function downloadFabric(canvas,name){
  //  convert the canvas to a data url and download it.
  download(canvas.toDataURL({multiplier: 4}),name+'.png' );
}

$("#submit").click(function(){
    canvas.deactivateAll().renderAll(); //Deselect All

    // canvasFull = new fabric.Canvas('c-full');

    // images = canvas.getObjects()
    // for (i in images){
    //   images[i].clone(function(image){

    //     console.log("Scale")
    //     // image.setFlipX(true)

    //     image.scale(image.getScaleX()*1)
    //     console.log("Done")
    //     console.log(image)
    //     canvasFull.add(image)
    //     console.log(canvasFull)
    //     downloadFabric(canvasFull, "test")
    //   })
    // }

    console.log(canvas.toDataURL({multiplier: 4}))
    //downloadFabric(canvas,'test');
});

$("#back").click(sendToBack);
$("#front").click(bringToFront);




/*
* Sends currently selected image object to the back
*/
function sendToBack(){
  console.log("Send to Back")
  image = canvas.getActiveObject();
  if (image) canvas.sendToBack(image)
}

/*
* Brings currently selected image object to the front
*/
function bringToFront(){
  console.log("Bring To Front")
  image = canvas.getActiveObject();
  if (image) canvas.bringToFront(image)
}


