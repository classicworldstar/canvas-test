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
            enable   : false, //valid,invalid 有効、無効
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
    mapFileName: "",
    mapWidth: "",
    mapHeight: "",
    camFileName: "",
    camWidth: "",
    camHeight: "",
    region: /*region1, region2, ・・・*/ [
        {
            name     : "", /* "region1", "region2", ・・・*/
            index    : 0,
            enable   : true,
            mapPoints: [], //only axis data from mapPoints
            //mapNormPoints: [],
            camPoints: [], //only axis data from mapPoints
            //camNormPoints: []
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
var lRelativePath = "img\\";
var lMapFileName = ""; 
var lCamFileName = "";
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
    initialize();
    initFileName();
    initCanvas();
    document.getElementById("region_name_text_id").value ="input region name";
    document.getElementById("file_name_text_id").value ="output_data";
 /*   
    if(window.File && window.FileReader) {
        //File API
        alert("ご使用のブラウザはFile APIを実装しています");
    }else{
        alert("ご使用のブラウザはFile APIをサポートしていません");
    }
*/
    document.getElementById("clear_button_id").onclick = function(e) {
       
        for(var i = 0; i < lMapPoints.points.length; i++){
            canvas1.remove(lMapPoints.points[i].circle);
            canvas1.remove(lMapPoints.points[i].text);
        }
        lMapPoints.points.length=0;
        for(var i = 0; i < lCamPoints.points.length; i++){
            canvas2.remove(lCamPoints.points[i].circle);
            canvas2.remove(lCamPoints.points[i].text);
        }
        lCamPoints.points.length=0;
    };
    document.getElementById("clear_all_button_id").onclick = function(e) {
       
        for(var i = 0; i < lMapPoints.points.length; i++){
            canvas1.remove(lMapPoints.points[i].circle);
            canvas1.remove(lMapPoints.points[i].text);
        }
        lMapPoints.points.length=0;
        for(var i = 0; i < lCamPoints.points.length; i++){
            canvas2.remove(lCamPoints.points[i].circle);
            canvas2.remove(lCamPoints.points[i].text);
        }
        lCamPoints.points.length=0;

        for(var i = 0; i < lCameraData.region.length; i++){
            canvas1.remove(lCameraData.region[i].mapPolygon);
            canvas2.remove(lCameraData.region[i].camPolygon);
        }
        lCameraData.region.length = 0;
        canvas1.clear().renderAll();
        canvas2.clear().renderAll();
        initialize();
        initCanvas();
        setSelectedBgImg();
        form.myfile.value = ""; //json file name, select button            

    };
    document.getElementById("init_button_id").onclick = function(e) {
        window.location.reload(true);
        form.myfile.value = ""; //json file name, select button
    };

    document.getElementById("region_name_text_id").onclick = function(e) {
        document.getElementById("region_name_text_id").value ="";
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
        if(lMapPoints.points.length == lCamPoints.points.length){
            if(lMapPoints.points.length > 1 && lCamPoints.points.length > 1){
                // Map and Camera, number of circle point is same.
                lMapPoints.name = document.getElementById("region_name_text_id").value;
                lMapPoints.index = lMapRegionNo;
                drawPolygon(canvas1, lMapPoints, lMapRegionNo, 'blue');
                lMapRegionNo++;
                clearPoints(lMapPoints, lMapRegionNo);

                lCamPoints.name = document.getElementById("region_name_text_id").value;
                lCamPoints.index = lCamRegionNo;
                drawPolygon(canvas2, lCamPoints, lCamRegionNo, 'blue');
                lCamRegionNo++;
                clearPoints(lCamPoints, lCamRegionNo);
            }else{
                alert("the number of points > 1");
            }
        }else{
            alert("You need to set same number of points on map and camera");
        }
    };
    document.getElementById("file_name_text_id").onclick = function(e) {
        document.getElementById("file_name_text_id").value ="";
    };

    document.getElementById("json_button_id").onclick = function(e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        finishRegionData(lCameraNo); // finish the regiondata of cameraXX.
        var intrnlFileName = document.getElementById("file_name_text_id").value+"_internal_data.json"; 
        saveCameraData(intrnlFileName);
        var jsonFileName = document.getElementById("file_name_text_id").value+".json";
        saveOutputData(jsonFileName);
    };

    //Form要素を取得する
    var form = document.forms.myform;
    //ファイルが読み込まれた時の処理
    form.myfile.addEventListener('change', function(e) {
        if(lMapFileName == "" || lCamFileName == ""){
            form.myfile.value = ""; //json file name, select button            
            alert("set image data(jpg/png) on map and camera.");
            return;
        }
        initialize();
        if(canvas1 == null){
            canvas1 = new fabric.Canvas('canvas1');
            canvas1.isDrawingMode = true;
        }
        if(canvas2 == null){
            canvas2 = new fabric.Canvas('canvas2');
            canvas2.isDrawingMode = true;
        }

        document.getElementById("drawmode_button_id").value = "select off";
        canvas1.isDrawingMode = true;
        canvas2.isDrawingMode = true;

        //ここにファイル取得処理を書く
        if(e.target.files.length == 0){
            alert("can not open the file.");
            return;
        }
        var result = e.target.files[0];

        //FileReaderのインスタンスを作成する
        var reader = new FileReader();

        //読み込んだファイルの中身を取得する
        reader.readAsText( result );

        //ファイルの中身を取得後に処理を行う
        reader.addEventListener( 'load', function() {
            addLog(reader.result);   
            var data =  JSON.parse(reader.result); 
            for(var i = 0; i < data.region.length; i++){
                //lCameraData.region.push(data.region[i]);
                //lCameraData.region[i].name = data.region[i].name;
                lMapPoints.name = data.region[i].name;
                for(var k = 0; k < data.region[i].mapPoints.length; k++){
                    if(data.region[i].enable){
                        drawPoint(canvas1, lMapPoints, data.region[i].mapPoints[k].x, data.region[i].mapPoints[k].y, 'blue');
                    }else{
                        drawPoint(canvas1, lMapPoints, data.region[i].mapPoints[k].x, data.region[i].mapPoints[k].y,'red');    
                    }
                }
                if(data.region[i].enable){
                    drawPolygon(canvas1, lMapPoints, lMapRegionNo,'blue');
                }else{
                    drawPolygon(canvas1, lMapPoints, lMapRegionNo,'red');
                }
                lMapRegionNo++;
                clearPoints(lMapPoints, lMapRegionNo);

                lCamPoints.name = data.region[i].name;
                for(var k = 0; k < data.region[i].camPoints.length; k++){
                    if(data.region[i].enable){
                        drawPoint(canvas2, lCamPoints, data.region[i].camPoints[k].x, data.region[i].camPoints[k].y, 'blue');
                    }else{
                        drawPoint(canvas2, lCamPoints, data.region[i].camPoints[k].x, data.region[i].camPoints[k].y,'red');    
                    }
//                    drawPoint(canvas2, lCamPoints, data.region[i].camPoints[k].x, data.region[i].camPoints[k].y,'blue');
                }
//                drawPolygon(canvas2, lCamPoints, lCamRegionNo, 'blue');
                if(data.region[i].enable){
                    drawPolygon(canvas2, lCamPoints, lCamRegionNo,'blue');
                }else{
                    drawPolygon(canvas2, lCamPoints, lCamRegionNo,'red');
                }
                lCamRegionNo++;
                clearPoints(lCamPoints, lCamRegionNo);                
            }
            finishRegionData();
        });        
    });
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
            drawPoint(canvas1, lMapPoints, e.offsetX, e.offsetY, 'red');
        }else{
            //region enable true or false
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
            drawPoint(canvas2, lCamPoints, e.offsetX, e.offsetY, 'red');
        }else{
            //region enable true or false
           // selectRegion(lCameraNo, canvas2, lCamPoints, e.offsetX, e.offsetY);
        }        
        addLog("img_map_img_id,mousedown");
    });
    document.getElementById("div_cam_img_id").addEventListener("mouseup", function(e){
        addLog("img_cam_img_id,mouseup");
    });

    //file drop test
    var cancelEvent = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    document.addEventListener("dragover", cancelEvent, false);
    document.addEventListener("dragenter", cancelEvent, false);
    document.getElementById("canvas1").addEventListener("drop", function(e) {
        e.preventDefault();
        if(canvas1 == null){
            canvas1 = new fabric.Canvas('canvas1');
            canvas1.isDrawingMode = true;
        }
        if( e.target.id == "canvas1"){
            var file = e.dataTransfer.files[0];
            lMapFileName = file.name;
            // readerのresultプロパティに、データURLとしてエンコードされたファイルデータを格納
            //var reader = new FileReader();
            //reader.readAsDataURL(file);
            drawImage(canvas1,  lRelativePath+lMapFileName);
        }
    }, true);
    document.getElementById("canvas2").addEventListener("drop", function(e) {
        e.preventDefault();
        if(canvas2 == null){
            canvas2 = new fabric.Canvas('canvas2');
            canvas2.isDrawingMode = true;
        }
        if( e.target.id == "canvas2"){
            var file = e.dataTransfer.files[0];
            lCamFileName = file.name;
            drawImage(canvas2,  lRelativePath+lCamFileName);
        }
    }, false);    
}

function initialize(){
    lMapRegionNo = 0;
    lCamRegionNo = 0;
    lOutputData.region.length = 0;
    lMapPoints.points.length = 0;
    lCamPoints.points.length = 0;
    document.getElementById("drawmode_button_id").disabled = "";
    setRegionData(lCameraNo);
    setPointsData(lMapPoints, lMapRegionNo);
    setPointsData(lCamPoints, lCamRegionNo);
}
function initFileName(){
    lMapFileName = ""; 
    lCamFileName = "";
}
function initCanvas(){
    if(canvas1 != null){
        canvas1.clear().renderAll();
    }
    if(canvas2 != null){
        canvas2.clear().renderAll();
    }    
}

function setSelectedBgImg(){
    if(canvas1 == null){
        canvas1 = new fabric.Canvas('canvas1');
        canvas1.isDrawingMode = true;
        drawImage(canvas1, lRelativePath+lMapFileName);
    }else{
        if(lMapFileName != ""){
            drawImage(canvas1, lRelativePath+lMapFileName);
        }
    }
    if(canvas2 == null){
        canvas2 = new fabric.Canvas('canvas2');
        canvas2.isDrawingMode = true;
        drawImage(canvas2, lRelativePath+lCamFileName);
    }else{
        if(lCamFileName != ""){
            drawImage(canvas2, lRelativePath+lCamFileName);
        }
    }    
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
function drawPoint(canvas, targetPoints, offsetX, offsetY, color){
    if(canvas.isDrawingMode == true){
        var circle = addCircle(canvas,offsetX-5,offsetY-5,5, color);
        var text = setCircleAxis(canvas,offsetX-5,offsetY-5,5);

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

function drawPolygon(canvas, targetPoints, regionNo, color){
    var data = [];
    var normData = [];
    for(var i = 0; i < targetPoints.points.length; i++){
        var circle = addCircle(canvas,targetPoints.points[i].circle.left,targetPoints.points[i].circle.top, 5, color);
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
    var text = null;
    var center = {x:0,y:0};
    if(left != null && top != null){
        polygon = addPolygon(canvas, data, left, top);
        center = getcenter(data);
        text = addText(String(regionNo), canvas, center.x, center.y, 20, 'red');
        targetPoints.points.text = text;
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
            name     : data.name,
            index    : regionNo,
            enable   : true,
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
    return addText(sPoints, canvas, left+radius*2, top+radius*2, 10, 'black');
}
function addText(sInput, canvas, left, top, font_size, color){
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
    lOutputData.region.length = 0;
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
    lOutputData.name = "camera"+String(lCameraNo);
    lOutputData.mapFileName = lMapFileName;
    lOutputData.mapWidth = lBgImgSize.map.naturalWidth;
    lOutputData.mapHeight = lBgImgSize.map.naturalHeight;
    lOutputData.camFileName = lCamFileName;
    lOutputData.camWidth = lBgImgSize.cam.naturalWidth;
    lOutputData.camHeight = lBgImgSize.cam.naturalHeight;
    for(var i = 0; i < data.region.length; i++){
        var region = {
            name:"",
            index:0,
            enable: false,
            mapPoints: [],
            //mapNormPoints:[],
            camPoints: [],
            //camNormPoints:[]
        };
        region.name = data.region[i].name;
        region.index = data.region[i].index;
        region.enable = data.region[i].enable;
        //region.mapNormPoints.length = 0;
        //region.camNormPoints.length = 0;
        for(k = 0; k < data.region[i].mapPolygon.points.length; k++){
            var norm_point = {
                x: data.region[i].mapPolygon.points[k].x / lBgImgSize.map.width, //normalize
                y: data.region[i].mapPolygon.points[k].y / lBgImgSize.map.height //normalize
            };
            region.mapPoints.push(data.region[i].mapPolygon.points[k]);
            //region.mapNormPoints.push(norm_point);
        }
        for(k = 0; k < data.region[i].camPolygon.points.length; k++){
            var norm_point = {
                x: data.region[i].camPolygon.points[k].x / lBgImgSize.cam.width, //normalize
                y: data.region[i].camPolygon.points[k].y / lBgImgSize.cam.height //normalize
            }
            region.camPoints.push(data.region[i].camPolygon.points[k]);
            //region.camNormPoints.push(norm_point);
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
function getcenter(data){
    if(data.length < 1){
        return null;
    }
    ret = {x:0,y:0};
    for(var i = 0; i < data.length; i++){
        ret.x = ret.x + data[i].x;
        ret.y = ret.y + data[i].y;
    }
    ret.x = ret.x / data.length;
    ret.y = ret.y / data.length;
    return ret;    
}
function addLog(txt_log){
    document.getElementById("txt_log_id").innerHTML += '<a>' + txt_log + '</a><br>';
    var obj = document.getElementById("txt_log_id");
    if(!obj) return;
    obj.scrollTop = obj.scrollHeight;
}


function selectRegion(camenra_no, canvas, targetPoints, x, y){
    retParam = hitRegion(camenra_no, canvas, x, y); 
    if(retParam.enable){
        addLog("hitRegion");

        for(var i = 0; i < retParam.points.length; i++){
            /*
            var left = retParam.points[i].circle.left;
            var top = retParam.points[i].circle.top;
            var radius = retParam.points[i].circle.radius;
            */
           var left = retParam.points[i].x;
           var top = retParam.points[i].y;
           var radius = 5;

            //canvas.remove(targetPoints.points[i].circle);
            var circle = null
            if(lCameraData.region[retParam.regionNo].enable){
                circle = addCircle(canvas, left-radius, top-radius, radius, 'red');
            }else{
                circle = addCircle(canvas, left-radius, top-radius, radius, 'blue');    
            }
            if(circle){
//                canvas.remove(retParam.points[i].circle); circleを共通のパラメータにしないと余計なcircleを残すことになる。今は修正できていない。
//                targetPoints.points[i].circle = circle;        
            }

        }
        if(lCameraData.region[retParam.regionNo].enable){
            lCameraData.region[retParam.regionNo].enable = false;
        }else{
            lCameraData.region[retParam.regionNo].enable = true;
        }
    }
}

function hitRegion(camenra_no, canvas, x, y){
    var retParam = {
        regionNo: 0,
        enable: false,
        points: [],
    };
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
                retParam.regionNo = i;
                retParam.enable = true;    
                retParam.points = lCameraData.region[i].mapPolygon.points;                
            }
        }
    }else if(canvas.lowerCanvasEl.id == "canvas2"){ //cam
        for(var i = 0; i < lCameraData.region.length; i++){
            left = getleft(lCameraData.region[i].camPolygon.points);
            right = getright(lCameraData.region[i].camPolygon.points);
            top = gettop(lCameraData.region[i].camPolygon.points);
            bottom = getbottom(lCameraData.region[i].camPolygon.points);
            if(isHit(left, right,top,bottom,x,y)){
                retParam.regionNo = i;
                retParam.enable = true;                    
                retParam.points = lCameraData.region[i].camPolygon.points;             }
        }   
    }
    return retParam;
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
