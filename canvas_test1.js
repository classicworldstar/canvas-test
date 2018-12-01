var mapPoints = [
    {     
        name    : "", //"area1", "area2",・・・・
        index   : 0,
        circle  : null, //bule circle display object
        text    : null, //axis display object
        focus   : true,
//        offsetX : 0,
//        offsetY : 0
    }
];
var camPoints = [
    {     
        name    : "", //"area1", "area2",・・・・
        index   : 0,
        circle  : null,
        text    : null,
        focus   : true,
//        offsetX : 0,
//        offsetY : 0
    }
];
/*
{
    "camera1": {
        "region1": {
            "cameraPoints": [[10, 15],[20, 15],[30, 20]],
            "mapPoints": [[90, 45],[15, 30],[60, 30]]
        },
        "region2": {
            "cameraPoints": [[100, 50],[50, 50],[50, 0],[100, 0]],
            "mapPoints": [[30, 45],[60, 45],[60,60],[30,60]]
        }
    },
    "camera2": {
        "region1": {
            "cameraPoints": [["""Coordinates in here"""]],
            "mapPoints": [["""Coordinates in here"""]]
        },
        "region2": {
            "cameraPoints": [["""Coordinates in here"""]],
            "mapPoints": [["""Coordinates in here"""]]
        }
    }
}
*/
var RegionData = [
    {
        name: "", //camera1, camera2, ・・・
        region1: {
            mapPoints: [],
            camPoints: [],
        },
        region2: {
            mapPoints: [],
            camPoints: [],
        },
        region3: {
            mapPoints: [],
            camPoints: [],
        },
        focusRegionNo: 1,
        finish: false,
    }
];
var cameraNo = 0;
var regionNo = 0;
//json保存を作成する機能を作ったら  ai-posingへ移植する


var canvas1 = null; //map image display 
var canvas2 = null; //camera image display 
var data1 = null; //json data of canvas1 
var data2 = null; //json data of canvas2 
var mapFileName = "top.jpg"; 
var camFileName = "cam0.jpg";
var bgImgSize = { //information of background image at map area and camera area
    map:{
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight:0
    },
    cam:{
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight:0
    }
};

window.onload=function(){

    document.getElementById("init_button_id").onclick = function(e) {
        // Initialize
        regionNo = 1;
        RegionData.length = 0;
        mapPoints.length = 0;
        camPoints.length = 0;
        if(canvas1 == null){
            canvas1 = new fabric.Canvas('canvas1');
            canvas1.isDrawingMode = true;
            drawImage(canvas1, mapFileName);
        }
        if(canvas2 == null){
            canvas2 = new fabric.Canvas('canvas2');
            canvas2.isDrawingMode = true;
            drawImage(canvas2, camFileName);
        }
        document.getElementById("drawmode_button_id").disabled = "";
        setRegionData(cameraNo, "camera00");
    };
    
    document.getElementById("drawmode_button_id").onclick = function(e) {
        // draw mode on <-> off

        if(canvas1.isDrawingMode == true){
            document.getElementById("drawmode_button_id").value = "select on";
            canvas1.isDrawingMode = false;
            canvas2.isDrawingMode = false;
        }else{
            document.getElementById("drawmode_button_id").value = "select off";
            canvas1.isDrawingMode = true;
            canvas2.isDrawingMode = true;
        }
    };
    
    document.getElementById("set_polygon_button_id").onclick = function(e) {
        // set polygon data for n region.
        drawPolygon(canvas1, mapPoints);
        mapPoints.length = 0;
        drawPolygon(canvas2, camPoints);
        camPoints.length = 0;
        regionNo++;
    };

    document.getElementById("json_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        data1 = JSON.stringify(canvas1);
        data2 = JSON.stringify(canvas2);
        addLog(data1);
        addLog(data2);
        finishRegionData(cameraNo); // finish the regiondata of cameraXX.
        saveJsonData("camera00.json");
        regionNo = 0;
    };
    /*
    document.getElementById("clear_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        canvas1.clear().renderAll();
        canvas2.clear().renderAll();
    };
    document.getElementById("restore_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        canvas1.loadFromJSON(data1).renderAll();
        canvas2.loadFromJSON(data2).renderAll();
    };
    */
    document.getElementById("div_map_img_id").addEventListener("mousedown", function(e){        
        //canvas1,map
        if(canvas1.isDrawingMode){
            //set clicked point, draw circle.
            drawCircle(canvas1, mapPoints, e.offsetX, e.offsetY);
        }else{
            //move point, drug and drop

        }
        addLog("img_map_img_id,mousedown");
    });
    document.getElementById("div_map_img_id").addEventListener("mouseup", function(e){
        addLog("img_map_img_id,mouseup");
    });
    document.getElementById("div_cam_img_id").addEventListener("mousedown", function(e){
        //canvas2,camera
        if(canvas2.isDrawingMode){
            //set clicked point, draw circle.
            drawCircle(canvas2, camPoints, e.offsetX, e.offsetY);
        }else{
            //move point, drug and drop
        }        
        addLog("img_map_img_id,mousedown");
    });
    document.getElementById("div_cam_img_id").addEventListener("mouseup", function(e){
        addLog("img_cam_img_id,mouseup");
    });

}

function drawImage(canvas, fileName){
    var img = new Image();
    img.src = fileName;//+'?' + new Date().getTime();
    /* 画像が読み込まれるのを待ってから処理を続行 */
    img.onload = function() {
        canvas.setBackgroundImage(fileName, canvas.renderAll.bind(canvas), {
            backgroundImageOpacity: 0.5,
            backgroundImageStretch: false,
        }); 
        if(canvas.lowerCanvasEl.id == "canvas1"){
            bgImgSize.map.width = img.width;
            bgImgSize.map.height = img.height;
            bgImgSize.map.naturalWidth = img.naturalWidth;
            bgImgSize.map.naturalHeight = img.naturalHeight;          
        }else if(canvas.lowerCanvasEl.id == "canvas2"){
            bgImgSize.cam.width = img.width;
            bgImgSize.cam.height = img.height;
            bgImgSize.cam.naturalWidth = img.naturalWidth;
            bgImgSize.cam.naturalHeight = img.naturalHeight;          
        }
    }
}

function drawCircle(canvas, targetPoints, offsetX, offsetY){
    if(canvas.isDrawingMode == true){
        var circle = addCircle(canvas,offsetX-5,offsetY-5,5, 'red');
        var text = setCircleAxis(canvas,offsetX-5,offsetY-5,5);
        var x = circle.left;
        var y = circle.top;
        var Points = {  
                name    : "",
                index   : 0,
                circle  : circle,
                text    : text,
                focus   : true, 
//                offsetX : offsetX,
//                offsetY : offsetY
        };
        targetPoints.push(Points);
        var i = targetPoints.length-1;
        targetPoints[i].name = "area" + String(targetPoints[i].index);
        targetPoints[i].index = i;
    }else{
    }
}

function drawPolygon(canvas, targetPoints){
    var data = [];
    var normData = [];
    data.length = 0;
    for(var i = 0; i < targetPoints.length; i++){
        var circle = addCircle(canvas,targetPoints[i].circle.left,targetPoints[i].circle.top, 5,'blue');
        canvas.remove(targetPoints[i].circle);
        targetPoints[i].circle = circle;
        var points = {
            x : targetPoints[i].circle.left + targetPoints[i].circle.radius,
            y : targetPoints[i].circle.top + targetPoints[i].circle.radius
        };
        var normPoints = {
            x : targetPoints[i].circle.left + targetPoints[i].circle.radius,
            y : targetPoints[i].circle.top + targetPoints[i].circle.radius
        };
       data.push(points);
       normData.push(normPoints);
    }
    var left = getleft(data);
    var top = gettop(data);
    if(left != null && top != null){
        addPolygon(canvas, data, left, top);
    }

    //normalization 0.0 <-> 1.0
    for(var i = 0; i < normData.length; i++){
        if(canvas.lowerCanvasEl.id == "canvas1"){ //map
            normData[i].x = normData[i].x / bgImgSize.map.width; 
            normData[i].y = normData[i].y / bgImgSize.map.height; 
        }else if(canvas.lowerCanvasEl.id == "canvas2"){ //cam
            normData[i].x = normData[i].x / bgImgSize.cam.width; 
            normData[i].y = normData[i].y / bgImgSize.cam.height; 
        }
        
    }
    addRegionData(cameraNo, canvas, normData, regionNo);

}
function addPolygon(canvas, data, left, top){
    var polygon = new fabric.Polygon(data, {
        left: left,  
        top: top,
        fill: 'rgba(200, 200, 200, 0.5)',
        stroke: 'rgba(255, 0, 0, 0.5)',
        strokeWidth: 3,
        selectable: false
    });
    canvas.add(polygon);
}


function setRegionData(camNo, name){
    var data =     {
        name: name, 
        region1: {
            mapPoints: [],
            camPoints: [],
        },
        region2: {
            mapPoints: [],
            camPoints: [],
        },
        region3: {
            mapPoints: [],
            camPoints: [],
        },
        focusRegionNo:1,
        finish: false,
    };
    RegionData.push(data);
}
function addRegionData(camNo, canvas, data, regionNo){
    if(canvas.lowerCanvasEl.id == "canvas1"){ //map
        if(regionNo == 1){
            RegionData[camNo].region1.mapPoints.push(data);
        }else if(regionNo == 2){
            RegionData[camNo].region2.mapPoints.push(data);
        }else if(regionNo == 3){
            RegionData[camNo].region3.mapPoints.push(data);
        }
    }else if(canvas.lowerCanvasEl.id == "canvas2"){ //cam
        if(regionNo == 1){
            RegionData[camNo].region1.camPoints.push(data);
        }else if(regionNo == 2){
            RegionData[camNo].region2.camPoints.push(data);
        }else if(regionNo == 3){
            RegionData[camNo].region3.camPoints.push(data);
        }   
    }
}
function finishRegionData(camNo){
    RegionData[camNo].finish = true;
}

function addCircle(canvas, left, top, radius, fill){
    var circle = new fabric.Circle({
        left: left,
        top: top,
        fill: fill,
        radius: radius
    });

    canvas.add(circle);

    if(circle){
        return circle;
    }else{
        return null;
    }
}
function removeCircle(canvas, circle){
    canvas.remove(circle);
}
function setCircleAxis(canvas, left, top, radius){
    sPoints = "[" + String(left+radius) + "," + String(top+radius) + "]";
    addAxisText(sPoints, canvas, left+radius*2, top+radius*2, 10, 'black');
}
function addAxisText(sInput, canvas, left, top, font_size, color){
    var text = new fabric.Text(sInput, {
        left: left,
        top: top,
        fontFamily: 'Arial',
        fontSize: font_size,
        fontWeight: 'bold',
        fill: color
    });
    canvas.add(text);
}

function saveJsonData(fileName){
    const blob = new Blob([JSON.stringify(RegionData, null, '  ')],
    {type: 'application\/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

function getleft(data){
    if(data.length < 1){
        return null;
    }else if(data.length < 2){
        return data[i];
    }
    var ret = data[0].x;
    for(var i = 0; i < data.length-1; i++){
        if(ret > data[i+1].x){
            ret = data[i+1].x;
        }
    }
    return ret;
}
function getright(data){
    if(data.length < 1){
        return null;
    }else if(data.length < 2){
        return data[i];
    }
    var ret = data[0].x;
    for(var i = 0; i < data.length-1; i++){
        if(ret < data[i+1].x){
            ret = data[i+1].x;
        }
    }
    return ret;
}
function gettop(data){
    if(data.length < 1){
        return null;
    }else if(data.length < 2){
        return data[i];
    }
    var ret = data[0].y;
    for(var i = 0; i < data.length-1; i++){
        if(ret > data[i+1].y){
            ret = data[i+1].y;
        }
    }
    return ret;
}
function getbottom(data){
    if(data.length < 1){
        return null;
    }else if(data.length < 2){
        return data[i];
    }
    var ret = data[0].y;
    for(var i = 0; i < data.length-1; i++){
        if(ret < data[i+1].y){
            ret = data[i+1].y;
        }
    }
    return ret;
}
function addLog(txt_log){
    document.getElementById("txt_log_id").innerHTML += '<a>' + txt_log + '</a><br>';
    var obj = document.getElementById("txt_log_id");
    if(!obj) return;
    obj.scrollTop = obj.scrollHeight;
}

/*
var RegionData = [
    {
        name: "", //camera1, camera2, ・・・
        region1: {
            mapPoints: [],
            camPoints: [],
        },
        region2: {
            mapPoints: [],
            camPoints: [],
        },
        region3: {
            mapPoints: [],
            camPoints: [],
        },
        finish: false,
    }
];
RegionData[camNo].region1.mapPoints
RegionData[camNo].region1.camPoints
*/
function hitPolygon(canvas, x, y){
    var left;
    var right;
    var top;
    var bottom;
    if(canvas.lowerCanvasEl.id == "canvas1"){ //map
        left = getleft(RegionData[camNo].region1.mapPoints);
        right = getright(RegionData[camNo].region1.mapPoints);
        top = gettop(RegionData[camNo].region1.mapPoints);
        bottom = getbottom(RegionData[camNo].region1.mapPoints);
        if(isHit(left, right,top,bottom,x,y)){
            return 1;
        }
    }else if(canvas.lowerCanvasEl.id == "canvas2"){ //cam

    }
}
function isHit(pos_x1, pos_x2, pos_y1, pos_y2, x, y){
    if(pos_x1 <= x && x <= pos_x2){
        if(pos_y1 <= y && y <= pos_y2){
            var log = "Hit:" + String(pos_x1) + "<=" + String(x) + "<" + String(pos_x2) + ", " + String(pos_y1) + "<=" + String(y) + "<" + String(pos_y2);
            addLog(log);
            return true;
        }
    }
    var log = "noHit:" + String(pos_x1) + "<=" + String(x) + "<" + String(pos_x2) + ", " + String(pos_y1) + "<=" + String(y) + "<" + String(pos_y2);
    addLog(log);
    return false;
}
