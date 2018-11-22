const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
  navigator.mediaDevices.getUserMedia({video:true,audio: false})
  .then(localMediaStream=>{
    console.log(localMediaStream);
    video.srcObject =localMediaStream;
    video.play();
  })
  .catch(err=>{
    console.error('oh, no!!!',err);
  });
}
function paintToCanvas(){
  const width = video.videoWidth;
  const height = video.videoHeight;
  //console.log(width,height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(()=>{
    ctx.drawImage(video,0,0,width,height);
    //get data
    let pixels = ctx.getImageData(0,0,width,height);
    //process
    //pixels = rgbSplit(pixels);
    //ctx.globalAlpha = 0.2;
    pixels = greenScreen(pixels);
    //get data back
    ctx.putImageData(pixels,0,0);
  },16);
}

function takePhoto(){
  snap.currentTime = 0;
  snap.play();
  //take the data from canvas
  const data = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download','handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man"/>`;
  strip.insertBefore(link,strip.firstChild);
}

function redEffect(pixels){
    for(let i=0;i<pixels.data.length;i+=4){
      pixels.data[i] = pixels.data[i] + 100;
      pixels.data[i+1] = pixels.data[i+1] - 50;
      pixels.data[i+2] = pixels.data[i+2] * 0.5;
      //pixels[i+3]//    
    }
    return pixels;
}

function rgbSplit(pixels){
  for(let i=0;i<pixels.data.length;i+=4){
    pixels.data[i-150] = pixels.data[i] ;
    pixels.data[i+100] = pixels.data[i+1];
    pixels.data[i-150] = pixels.data[i+2];
    //pixels[i+3]//    
  }
  return pixels;
}

function greenScreen(pixels){
  const levels ={};
  document.querySelectorAll('.rgb input').forEach(input=>{
    //console.log(input.name,input.nodeValue);
    levels[input.name] = input.value;
  });
  console.log(levels);
  for(let i=0;i<pixels.data.length;i=i+4){
    let red = pixels.data[i];
    let green = pixels.data[i+1];
    let blue = pixels.data[i+2];
    //let alpha = pixels.data[i+3];
    if(red>=levels.rmin && green>=levels.gmin
      && blue>=levels.bmin&& red<=levels.rmax
      && green<=levels.gmax && blue<=levels.bmax){
        pixels.data[i+3] = 0;
      }
  }
  return pixels;
}
getVideo();

video.addEventListener('canplay',paintToCanvas);