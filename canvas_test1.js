var lMapPoints = {
    name: "", //"region1", "region2",・・・・
    index: 0, //regionNo
    points: [
        {     
            circle  : null, //bule circle display object
            text    : null, //axis display object
            focus   : true,
        }
    ]
};
var lCamPoints = {
    name: "", //"region1", "region2",・・・・
    index: 0,
    points: [
        {     
            circle  : null, //bule circle display object
            text    : null, //axis display object
            focus   : true,
        }
    ]
};

var lCameraData = {
    name: "camera0", //camera1, camera2, ・・・
    index: 0,
    region: [
        {
            name     : "", /* "region1", "region2", ・・・*/
            index    : 0,
            mapPolygon: null,
            mapPoints: [], //mapPoints data
            camPolygon: null,
            camPoints: [], //mapPoints data
        }
    ],
    focusRegionNo: 0,
    finish: false,
};

var lOutputData = {
    name: "camera0", //camera1, camera2, ・・・
    region: /*region1, region2, ・・・*/ [
        {
            name     : "", /* "region1", "region2", ・・・*/
            mapPoints: [], //only axis data from mapPoints
            camPoints: [], //only axis data from mapPoints
        }
    ],
};
var lCameraNo = 0;
var lMapRegionNo = 0;
var lCamRegionNo = 0;

//json保存を作成する機能を作ったら  ai-posingへ移植する


var canvas1 = null; //map image display 
var canvas2 = null; //camera image display 
//var data1 = null; //json data of canvas1 
//var data2 = null; //json data of canvas2 
var lMapFileName = "top.jpg"; 
var lCamFileName = "cam0.jpg";
var lBgImgSize = { //information of background image at map area and camera area
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
        lMapRegionNo = 0;
        lCamRegionNo = 0;
        lOutputData.region.length = 0;
        lMapPoints.points.length = 0;
        lCamPoints.points.length = 0;
        if(canvas1 == null){
            canvas1 = new fabric.Canvas('canvas1');
            canvas1.isDrawingMode = true;
            drawImage(canvas1, lMapFileName);
        }else{
            canvas1.clear().renderAll();
            drawImage(canvas1, lMapFileName);
        }
        if(canvas2 == null){
            canvas2 = new fabric.Canvas('canvas2');
            canvas2.isDrawingMode = true;
            drawImage(canvas2, lCamFileName);
        }else{
            canvas2.clear().renderAll();
            drawImage(canvas2, lCamFileName);
        }
//        document.getElementById("drawmode_button_id").disabled = "";
        setRegionData(lCameraNo);
        setPointsData(lMapPoints, lMapRegionNo);
        setPointsData(lCamPoints, lCamRegionNo);
    };
    /*
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
    */
    document.getElementById("set_polygon_button_id").onclick = function(e) {
        // set polygon data for n region.
        drawPolygon(canvas1, lMapPoints, lMapRegionNo);
        lMapRegionNo++;
        clearPoints(lMapPoints, lMapRegionNo);

        drawPolygon(canvas2, lCamPoints, lCamRegionNo);
        lCamRegionNo++;
        clearPoints(lCamPoints, lCamRegionNo);

    };

    document.getElementById("json_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        //data1 = JSON.stringify(canvas1);
        //data2 = JSON.stringify(canvas2);
        //addLog(data1);
        //addLog(data2);
        finishRegionData(lCameraNo); // finish the regiondata of cameraXX.
        saveCameraData("camera_data.json");
        saveOutputData("output_data.json");

        lMapRegionNo = 0;
        lCamRegionNo = 0;
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
            drawPoint(canvas1, lMapPoints, e.offsetX, e.offsetY);
        }else{
            //move point, drug and drop
            selectRegion(lCameraNo, canvas1, lMapPoints, e.offsetX, e.offsetY);
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
            drawPoint(canvas2, lCamPoints, e.offsetX, e.offsetY);
        }else{
            //move point, drug and drop
            selectRegion(lCameraNo, canvas2, lCamPoints, e.offsetX, e.offsetY);
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
            lBgImgSize.map.width = img.width;
            lBgImgSize.map.height = img.height;
            lBgImgSize.map.naturalWidth = img.naturalWidth;
            lBgImgSize.map.naturalHeight = img.naturalHeight;          
        }else if(canvas.lowerCanvasEl.id == "canvas2"){
            lBgImgSize.cam.width = img.width;
            lBgImgSize.cam.height = img.height;
            lBgImgSize.cam.naturalWidth = img.naturalWidth;
            lBgImgSize.cam.naturalHeight = img.naturalHeight;          
        }
    }
}

function setPointsData(targetPoints, regionNo){
    targetPoints.name = "region" + String(regionNo); //"region1", "region2",・・・・
    targetPoints.index = regionNo;
}
function drawPoint(canvas, targetPoints, offsetX, offsetY){
    if(canvas.isDrawingMode == true){
        var circle = addCircle(canvas,offsetX-5,offsetY-5,5, 'red');
        var text = setCircleAxis(canvas,offsetX-5,offsetY-5,5);
        var x = circle.left;
        var y = circle.top;

        var Points = {  
            circle  : circle,
            text    : text,
            focus   : true, 
        };
        targetPoints.points.push(Points);
    }else{
    }
}
function clearPoints(points, regionNo){
    points.name = "region" + regionNo;
    points.index = regionNo;
    points.points.length = 0;
}

function drawPolygon(canvas, targetPoints, regionNo){
    var data = [];
    var normData = [];
    for(var i = 0; i < targetPoints.points.length; i++){
        var circle = addCircle(canvas,targetPoints.points[i].circle.left,targetPoints.points[i].circle.top, 5,'blue');
        canvas.remove(targetPoints.points[i].circle);
        targetPoints.points[i].circle = circle;
        var points = {
            x : targetPoints.points[i].circle.left + targetPoints.points[i].circle.radius,
            y : targetPoints.points[i].circle.top + targetPoints.points[i].circle.radius
        };
        var normPoints = {
            x : targetPoints.points[i].circle.left + targetPoints.points[i].circle.radius,
            y : targetPoints.points[i].circle.top + targetPoints.points[i].circle.radius
        };
       data.push(points);
       normData.push(normPoints);
    }
    var left = getleft(data);
    var top = gettop(data);
    var polygon = null;
    if(left != null && top != null){
        polygon = addPolygon(canvas, data, left, top);
    }
    addRegionData(canvas, polygon, targetPoints, regionNo);
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
    if(polygon){
        return polygon;
    }else{
        return null;
    }
}


function setRegionData(camNo){
    lCameraData.name = "camera"+String(camNo);
    lCameraData.index = camNo;
    lCameraData.focusRegionNo = 0;
    lCameraData.finish = false;
    lCameraData.region.length = 0;
}
function addRegionData(canvas, polygon, data, regionNo){
    if(lCameraData.region.length <= regionNo){
        var region = {
            name     : "region" + String(regionNo),
            mapPolygon: null,
            mapPoints: [],
            camPolygon: null,
            camPoints: [],
        };
        lCameraData.region.push(region);
    }
    if(canvas.lowerCanvasEl.id == "canvas1"){ //map
        lCameraData.region[regionNo].mapPolygon = polygon;
        for(var i = 0; i < data.points.length; i++){
            lCameraData.region[regionNo].mapPoints.push(data.points[i]);
        }
    }else if(canvas.lowerCanvasEl.id == "canvas2"){ //cam
        lCameraData.region[regionNo].camPolygon = polygon;
        for(var i = 0; i < data.points.length; i++){
            lCameraData.region[regionNo].camPoints.push(data.points[i]);
        }
    }
}
function finishRegionData(camNo){
    lCameraData.finish = true;
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
    return addAxisText(sPoints, canvas, left+radius*2, top+radius*2, 10, 'black');
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
    if(text){
        return text;
    }else{
        return null;
    }
}

function saveCameraData(fileName){
    saveJsonData(fileName, lCameraData);
}
function saveOutputData(fileName){
    tranceCamDataToOutputData(lCameraData);
    saveJsonData(fileName, lOutputData);
}
function saveJsonData(fileName, data){
    const blob = new Blob([JSON.stringify(data, null, '  ')],
    {type: 'application\/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}
function tranceCamDataToOutputData(data){
    for(var i = 0; i < data.region.length; i++){
        var region = {
            name:"",
            mapNormPoints:[],
            camNormPoints:[]
        };
        region.name = data.region[i].name;
        region.mapNormPoints.length = 0;
        region.camNormPoints.length = 0;
        for(k = 0; k < data.region[i].mapPolygon.points.length; k++){
            region.mapNormPoints.push(data.region[i].mapPolygon.points[k]);
        }
        for(k = 0; k < data.region[i].camPolygon.points.length; k++){
            region.camNormPoints.push(data.region[i].camPolygon.points[k]);
        }
        for(k = 0; k < region.mapNormPoints.length; k++){
//            var norm_x = 
            region.mapNormPoints[k].x =  region.mapNormPoints[k].x / lBgImgSize.map.width; //normalize
            region.mapNormPoints[k].y =  region.mapNormPoints[k].y / lBgImgSize.map.height; //normalize
        }
        for(k = 0; k < region.camNormPoints.length; k++){
            region.camNormPoints[k].x =  region.camNormPoints[k].x / lBgImgSize.cam.width; //normalize
            region.camNormPoints[k].y =  region.camNormPoints[k].y / lBgImgSize.cam.height; //normalize
        }
        
        lOutputData.region.push(region);
    }
    lOutputData.name = data.name;
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

function selectRegion(camenra_no, canvas, points, x, y){
    if(hitRegion(camenra_no, canvas, points, x, y)){
        addLog("hitRegion");
        for(var i = 0; i < points.points.length; i++){
            var left = points.points[i].circle.left;
            var top = points.points[i].circle.top;
            var radius = points.points[i].circle.radius;
            canvas.remove(points.points[i].circle);
            points.points[i].circle = addCircle(canvas, left, top, radius, 'red');
        }
    }
}
function hitRegion(camenra_no, canvas, points, x, y){
    var left = 0;
    var right = 0;
    var top = 0;
    var bottom = 0;
    if(canvas.lowerCanvasEl.id == "canvas1"){ //map
        for(var i = 0; i < lCameraData.region.length; i++){
            left = getleft(lCameraData.region[i].mapPolygon.points);
            right = getright(lCameraData.region[i].mapPolygon.points);
            top = gettop(lCameraData.region[i].mapPolygon.points);
            bottom = getbottom(lCameraData.region[i].mapPolygon.points);
            if(isHit(left, right,top,bottom,x,y)){
                canvas.remove(lCameraData.region[i].mapPolygon);

                setPointsData(points, i);
                points.points.length = 0;
                for(var n = 0; n < lCameraData.region[i].mapPoints.length; n++){
                    points.points.push(lCameraData.region[i].mapPoints[n]);
                }
                return true;
            }
        }
    }else if(canvas.lowerCanvasEl.id == "canvas2"){ //cam
        for(var i = 0; i < lCameraData.region.length; i++){
            left = getleft(lCameraData.region[i].mapPolygon.points);
            right = getright(lCameraData.region[i].mapPolygon.points);
            top = gettop(lCameraData.region[i].mapPolygon.points);
            bottom = getbottom(lCameraData.region[i].mapPolygon.points);
            if(isHit(left, right,top,bottom,x,y)){
                canvas.remove(lCameraData.region[i].camPolygon);

                setPointsData(points, i);
                points.points.length = 0;
                for(var n = 0; n < lCameraData.region[i].camPoints.length; n++){
                    points.points.push(lCameraData.region[i].camPoints[n]);
                }                    
                return true;
            }
        }   
    }
    return false;
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
