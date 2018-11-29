

/** ドラッグで移動 */
// ドラッグ状態かどうか
let isDragging = false;
// ドラッグ開始位置
let start = {
    x: 0,
    y: 0
};
// ドラッグ終了後の位置
let end = {
    x: 0,
    y: 0
};

var arryCnv = [
    {     
        name : "",
        area : "",
        background : true, //背景画像判定　true：背景画像
        cnv: null,
        ctx: null,
        img: null,
        pageX: 0, //canvasのleft位置　page左端からのピクセル位置
        pageY: 0, //canvasのtop位置　pageトップからのピクセル位置
        offsetX: 0, //canvas内の相対座標
        offsetY: 0, //canvas内の相対座標
        width: 0,   //imgの大きさ
        height: 0   //imgの大きさ
    }
];

window.onload=function(){

    document.getElementById("test_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        //document.getElementById("div_img_id").innerHTML += '<a>test</a>';
        arryCnv.length = 0;

        drawImageBg("map", true,"cnv_map_bg_id", "top.jpg",0,0);
        createImage("map", false,"cnv_map_balloon1_id", "balloon1.png",0,0);
        createImage("map", false,"cnv_map_balloon2_id", "balloon2.png",50,0);
        createImage("map", false,"cnv_map_balloon3_id", "balloon3.png",0,50);
        createImage("map", false,"cnv_map_balloon4_id", "balloon4.png",50,50);

        drawImageBg("cam", true,"cnv_cam_bg_id", "cam0.jpg",0,0);
        createImage("cam", false,"cnv_cam_balloon1_id", "balloon1.png",0,0);
        createImage("cam", false,"cnv_cam_balloon2_id", "balloon2.png",50,0);
        createImage("cam", false,"cnv_cam_balloon3_id", "balloon3.png",0,50);
        createImage("cam", false,"cnv_cam_balloon4_id", "balloon4.png",50,50);

    };
    document.getElementById("div_map_img_id").addEventListener("mousedown", function(e){
        if(isHitCanvas("cnv_map_bg_id", e.pageX, e.pageY)){
            isDragging = true;
            //座標を取得し、格納
            start.x = e.pageX;
            start.y = e.pageY;
            var log = "down:" + " start:" + String(start.x) + "," + String(start.y) + " offset:" + String(e.offsetX) + "," + String(e.offsetY)  + " end:" + String(end.x) + "," + String(end.y);
            addLog(log);
        }
    });
    document.getElementById("div_map_img_id").addEventListener("mouseup", function(e){
        if(isHitCanvas("cnv_map_bg_id", start.x, start.y)){
            isDragging = false;
            end.x = e.pageX;
            end.y = e.pageY;
            redraw("map", "cnv_map_bg_id");
            

            var log = "up:" + " start:" + String(start.x) + "," + String(start.y) + " offset:" + String(e.offsetX) + "," + String(e.offsetY)  + " end:" + String(end.x) + "," + String(end.y);
            addLog(log);
        }
    });
    document.getElementById("div_cam_img_id").addEventListener("mousedown", function(e){
        if(isHitCanvas("cnv_cam_bg_id", e.pageX, e.pageY)){
            isDragging = true;
            //座標を取得し、格納
            start.x = e.pageX;
            start.y = e.pageY;
            var log = "down:" + " start:" + String(start.x) + "," + String(start.y) + " offset:" + String(e.offsetX) + "," + String(e.offsetY)  + " end:" + String(end.x) + "," + String(end.y);
            addLog(log);
        }
    });
    document.getElementById("div_cam_img_id").addEventListener("mouseup", function(e){
        if(isHitCanvas("cnv_cam_bg_id", start.x, start.y)){
            isDragging = false;
            end.x = e.pageX;
            end.y = e.pageY;
            redraw("cam", "cnv_cam_bg_id");
            

            var log = "up:" + " start:" + String(start.x) + "," + String(start.y) + " offset:" + String(e.offsetX) + "," + String(e.offsetY)  + " end:" + String(end.x) + "," + String(end.y);
            addLog(log);
        }
    });

}

function drawImageBg(area, bg, target, fileName, x, y) {
    var canvas = document.getElementById(target);
    if ( ! canvas || ! canvas.getContext ) { return false; }
    /* Imageオブジェクトを生成 */
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = fileName+'?' + new Date().getTime();
    /* 画像が読み込まれるのを待ってから処理を続行 */
    img.onload = function() {
        var imageWidth = img.width;
        var imageHeight = img.height;
    
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var canvasSizeRatio = canvasHeight / canvasWidth;
        var imageSizeRatio = imageHeight / imageWidth;
        if(imageSizeRatio <= canvasSizeRatio){
            var TranceWidth = canvasWidth;
            var conpRatio = canvasWidth / imageWidth;
            var TranceHeight = conpRatio * imageHeight;
        }else{
            var TranceHeight = canvasHeight;
            var conpRatio = canvasHeight / imageHeight;
            var TranceWidth = conpRatio * imageWidth;
        }
  //    ctx.drawImage(img, x, y, 400, 300);  
        ctx.drawImage(img, 0, 0, img.width, img.height, x, y, TranceWidth, TranceHeight); 
        creatBalloon(target, area, bg, canvas,ctx,img,canvas.getBoundingClientRect().left,canvas.getBoundingClientRect().top,x,y,TranceWidth,TranceHeight); 
    }
  }
  

function createImage(area, bg, target, fileName, x, y) {
    var canvas = document.getElementById(target);
    if ( ! canvas || ! canvas.getContext ) { return false; }
    /* Imageオブジェクトを生成 */
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = fileName+'?' + new Date().getTime();
//    img.crossOrigin = 'anonymous';
    
    /* 画像が読み込まれるのを待ってから処理を続行 */
    img.onload = function() {
        // Canvasを画像のサイズに合わせる
        //canvas.height = img.height;
        //canvas.width  = img.width;

        ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width, img.height);           

        setAxisText(ctx, img, x, y);
        
        creatBalloon(target, area, bg, canvas, ctx, img, canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top, x, y, img.width, img.height);
        return ctx;
    }
    img.onerror = function() {
        console.log('画像の読み込み失敗');
    };
    
}

function redraw(area, target){
    var canvas = getTargetCanvas(target);
    var pageX = canvas.getBoundingClientRect().left;
    var pageY = canvas.getBoundingClientRect().top;
    
    var data = IsHitballoon(area, start.x - pageX, start.y - pageY);
    if(data.background == false){
        data.ctx.clearRect(0, 0, data.cnv.getBoundingClientRect().width, data.cnv.getBoundingClientRect().height);
        var pos_x1 = 0;
        var pos_x2 = data.cnv.getBoundingClientRect().width;
        var pos_y1 = 0;
        var pos_y2 = data.cnv.getBoundingClientRect().height;
        var offsetX = end.x - pageX;
        var offsetY = end.y - pageY;
        if(offsetX < pos_x1){
            offsetX = 0;
        }else if(pos_x2 < offsetX){
            offsetX = pos_x2;
        }
        if(offsetY < pos_y1){
            offsetY = 0;
        }else if(pos_y2 < offsetY){
            offsetY = pos_y2;
        }
        data.ctx.drawImage(data.img, 0, 0, data.img.width, data.img.height, offsetX, offsetY, data.img.width, data.img.height);
        setBalloonPos(data.cnv, offsetX, offsetY);
    }
}

function creatBalloon(target, area, bg, cnv, ctx, img, pageX, pageY, offsetX, offsetY, width, height){
    var data = {
        name : target,
        area : area,
        background  : bg,
        cnv     : cnv,
        ctx     : ctx,
        img     : img,
        pageX   : pageX,
        pageY   : pageY,
        offsetX : offsetX,
        offsetY : offsetY,
        width   : width,
        height  : height
    }
    arryCnv.push(data);
}
function setBalloonPos(cnv, offsetX, offsetY){
    for(var i = 0; i < arryCnv.length; i++){
        if(arryCnv[i].cnv == cnv){
            arryCnv[i].offsetX = offsetX;
            arryCnv[i].offsetY = offsetY;
            setAxisText(arryCnv[i].ctx, arryCnv[i].img, arryCnv[i].offsetX, arryCnv[i].offsetY);
        }
    }
}

function setAxisText(ctx, img,x,y){
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)'
    ctx.fillRect(x+img.width,y+img.height/2,60,15);

    ctx.font = "14px 'Times New Roman'";
    ctx.fillStyle = "#000";
    ctx.fillText('['+String(x)+','+String(y)+']', x+img.width, y+img.height);
}

function IsHitballoon(area, x, y){
    var data = arryCnv;
    for(var i = 0; i < data.length; i++){
        if(data[i].area == area && data[i].background == false){
            var pos_x1 = data[i].offsetX;
            var pos_y1 = data[i].offsetY;
            var pos_x2 = pos_x1 + data[i].width;
            var pos_y2 = pos_y1 + data[i].height;

            if(pos_x1 <= x && x < pos_x2){
                if(pos_y1 <= y && y < pos_y2){
                    var log = "hitImg:" + String(pos_x1) + "<=" + String(x) + "<" + String(pos_x2) + "|" + String(pos_x1) + "+" + String(data[i].width) + ", " + String(pos_y1) + "<=" + String(y) + "<" + String(pos_y2) + "|" + String(pos_y1) + "+" + String(data[i].height);
                    addLog(log);
                    return data[i];
                }   
            }
        }
    }
    var log = "nullImg,area:" + area + ",click_pos:" + String(x) + "," + String(y);
    addLog(log);
    return null;
}

function isHitCanvas(target, x, y){
    var canvas = getTargetCanvas(target);
    var pos_x1 = canvas.getBoundingClientRect().left;
    var pos_x2 = pos_x1 + canvas.getBoundingClientRect().width;
    var pos_y1 = canvas.getBoundingClientRect().top;
    var pos_y2 = pos_y1 + canvas.getBoundingClientRect().height;
    if(pos_x1 <= x && x <= pos_x2){
        if(pos_y1 <= y && y <= pos_y2){
            //var log = "hitCnv:" + String(pos_x1) + "<=" + String(x) + "<" + String(pos_x2) + ", " + String(pos_y1) + "<=" + String(y) + "<" + String(pos_y2);
            //addLog(log);
            return true;
        }
    }
    //var log = "nullCnv:" + String(pos_x1) + "<=" + String(x) + "<" + String(pos_x2) + ", " + String(pos_y1) + "<=" + String(y) + "<" + String(pos_y2);
    //addLog(log);
    return false;
}

function getTargetCanvas(target){
    for(var i = 0; i < arryCnv.length; i++){
        if(arryCnv[i].name == target){
            return arryCnv[i].cnv;
        }
    }
    return null;
}


function addLog(txt_log){
    document.getElementById("txt_log_id").innerHTML += '<a>' + txt_log + '</a><br>';
    var obj = document.getElementById("txt_log_id");
    if(!obj) return;
    obj.scrollTop = obj.scrollHeight;
}
