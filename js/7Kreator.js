var canvas  = new fabric.Canvas('c');
$(document).ready(function(){
  console.log("Ready")
 // canvas.setOverlayImage('7kback.png', canvas.renderAll.bind(canvas));
});

currentX = 0; currentY = 0;
X_OFFSET = 50; Y_OFFSET = 220;
X_MAX = 1500; Y_MAX = 450

// Keep track of cursor position
$(document).mousemove(function (e) {
    currentX = e.pageX;
    currentY = e.pageY;
});

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  var reader  = new FileReader();

  reader.onloadend = function () {
      console.log(reader.result)
      fabric.Image.fromURL(reader.result, function(oImg) {

        var size = oImg.getOriginalSize()

        if (size.width > X_MAX) oImg.scale((1/(size.width/X_MAX)));
        if (size.height > Y_MAX) oImg.scale((1/(size.height/Y_MAX)));

        console.log(oImg.getScaleX())
        console.log(oImg.getScaleY())


        oImg.setLeft(evt.pageX-X_OFFSET);
        oImg.setTop(evt.pageY-Y_OFFSET);
        canvas.add(oImg);
        // canvas.sendBackwards(oImg);
        canvas.bringToFront(oImg);

      });
  }
  var file = files[0]

  if (file) {
    reader.readAsDataURL(file);
  }
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
$("#delete").click(deleteImage);
$("#copy").click(copyImage);
$("#paste").click(pasteImage);

//Listen To keyDown events
var canvasWrapper = document.getElementById('drop_zone');
canvasWrapper.tabIndex = 1000;
canvasWrapper.addEventListener("keydown", processKeyDown, false);

/*
* Cntl-C: Copy the image
* Ctrk-V: Paste the image
* Ctrl-X: Cut (copy + delete) the Image
* Backspace or Del: Delete the image
*/
function processKeyDown(e){
  var c_keyCode = 67,  v_keyCode = 86, x_keyCode = 88, del_keyCode = 46, backSpace_keyCode = 8;
  //console.log(e.which)

  if (e.which == del_keyCode || e.which == backSpace_keyCode) deleteImage();
  if ( e.ctrlKey ||  e.metaKey) { //Control or command key
    switch(e.which){
      case c_keyCode:
        copyImage();
        break;
      case v_keyCode:
        pasteImage(e)
        break;
      case x_keyCode:
        copyImage();
        deleteImage();
    }
  }
}

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

/*
* Removes the selected image from the canvas
*/
function deleteImage(){
  console.log("Delete")
  image = canvas.getActiveObject();
  if (image) image.remove()
}

var copiedImage;
/*
* Updates the current copied image to the selected Image
*/
function copyImage(){
  console.log("copy");
  copiedImage = canvas.getActiveObject();
}

/*
* Adds the copied image to the canvas
*/
function pasteImage(e){
  if (!copiedImage) return;
  copiedImage.clone(function(img){
    console.log(currentX);
    console.log(currentY);
    img.setLeft(currentX-X_OFFSET);
    img.setTop(currentY-Y_OFFSET);
    canvas.add(img);
  });
}
