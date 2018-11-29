var mapPoints = [
    {     
        name    : "", //"area1", "area2",・・・・
        index   : 0,
        offsetX : 0,
        offsetY : 0
    }
];
var camPoints = [
    {     
        name    : "", //"area1", "area2",・・・・
        index   : 0,
        offsetX : 0,
        offsetY : 0
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
            cameraPoints: [[]],
            mapPoints: [[]]
        },
        region2: {
            cameraPoints: [[]],
            mapPoints: [[]]
        },
        region3: {
            cameraPoints: [[]],
            mapPoints: [[]]
        }
    }
];

var canvas1 = null;
var canvas2 = null;
var data1 = null;
var data2 = null;
var mapFileName = "top.jpg";
var camFileName = "cam0.jpg";

window.onload=function(){

    document.getElementById("init_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        //document.getElementById("div_img_id").innerHTML += '<a>test</a>';
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
    };
    document.getElementById("drawmode_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する

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
        // ここに#buttonをクリックしたら発生させる処理を記述する
        drawPolygon(canvas1, mapPoints);
        drawPolygon(canvas2, camPoints);
    };

    document.getElementById("json_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        data1 = JSON.stringify(canvas1);
        data2 = JSON.stringify(canvas2);
        addLog(data1);
        addLog(data2);

    };
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

    document.getElementById("div_map_img_id").addEventListener("mousedown", function(e){        
        drawCircle(canvas1, mapPoints, e.offsetX, e.offsetY);
        //drawImage(canvas1, mapFileName);
        addLog("img_map_img_id,mousedown");
    });
    document.getElementById("div_map_img_id").addEventListener("mouseup", function(e){
        addLog("img_map_img_id,mouseup");
    });
    document.getElementById("div_cam_img_id").addEventListener("mousedown", function(e){
        drawCircle(canvas2, camPoints, e.offsetX, e.offsetY);        
        //drawImage(canvas2, camFileName);
        addLog("img_map_img_id,mousedown");
    });
    document.getElementById("div_cam_img_id").addEventListener("mouseup", function(e){
        addLog("img_cam_img_id,mouseup");
    });

}

function drawImage(canvas, fileName){
    var width = canvas.getWidth();
    var height = canvas.getHeight();
    canvas.setBackgroundImage(fileName, canvas.renderAll.bind(canvas), {
        backgroundImageOpacity: 0.5,
        backgroundImageStretch: false,
        width: width,
        height: height,
    });
}

function drawCircle(canvas, targetPoints, offsetX, offsetY){
    if(canvas.isDrawingMode == true){
        var circle = addCircle(canvas,offsetX-5,offsetY-5,5);
        var Points = {     
                name    : "",
                index   : 0,
                offsetX : 0,
                offsetY : 0
        };
        targetPoints.push(Points);
        var i = targetPoints.length-1;
        targetPoints[i].index = i;
        targetPoints[i].name = "area" + String(targetPoints[i].index);
        targetPoints[i].offsetX = offsetX;
        targetPoints[i].offsetY = offsetY;
    }else{
    }
}

function drawPolygon(canvas, targetPoints){
    var data = [];
    data.length = 0;
    for(var i = 0; i < targetPoints.length; i++){
        var points = {
            x : targetPoints[i].offsetX,
            y : targetPoints[i].offsetY
        };
       data.push(points);
    }
    var left = getleft(data);
    var top = gettop(data);
    if(left != null && top != null){
        addPolygon(canvas, data, left, top);
    }
}
function addCircle(canvas, left, top, radius){
    var circle = new fabric.Circle({
        left: left,
        top: top,
        fill: 'blue',
        radius: radius
    });

    canvas.add(circle);
    sPoints = "[" + String(left+radius) + "," + String(top+radius) + "]";
    addAxisText(sPoints, canvas, left+radius*2, top+radius*2, 10, 'black');

    if(circle){
        return circle;
    }else{
        return null;
    }
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

function addLog(txt_log){
    document.getElementById("txt_log_id").innerHTML += '<a>' + txt_log + '</a><br>';
    var obj = document.getElementById("txt_log_id");
    if(!obj) return;
    obj.scrollTop = obj.scrollHeight;
}
