var lMapPoints = {
    name: "", //"region1", "region2",・・・・
    index: 0, //regionNo
    points: [
        {
            circle: null, //bule circle display object
            text: null, //axis display object
            focus: true,
        }
    ]
};
var lCamPoints = {
    name: "", //"region1", "region2",・・・・
    index: 0,
    points: [
        {
            circle: null, //bule circle display object
            text: null, //axis display object
            focus: true,
        }
    ]
};

var lCameraData = {
    name: "camera0", //camera1, camera2, ・・・
    index: 0,
    region: [
        {
            name: "", /* "region1", "region2", ・・・*/
            index: 0,
            enable: false, //valid,invalid 有効、無効
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
    region: /*region1, region2, ・・・*/[
        {
            name: "", /* "region1", "region2", ・・・*/
            index: 0,
            enable: true,
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

var canvas_map_bg = null; //map image display   canvas1
var canvas_map_top = null; //map image display  canvas1
var canvas_cam_bg = null; //cam image display   canvas2 
var canvas_cam_top = null; //cam image display  canvas2
//var canvas1 = null; //map image display 
//var canvas2 = null; //camera image display 
//var canvas3 = null; //test image display 
//var data1 = null; //json data of canvas1 
//var data2 = null; //json data of canvas2 
var lRelativePath = "img\\";
var lMapFileName = "";
var lCamFileName = "";
var lBgImgSize = { //information of background image at map area and camera area
    map: {
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight: 0
    },
    cam: {
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight: 0
    }
};

window.onload = function () {
    initialize();
    initFileName();
    initCanvas();
    document.getElementById("camera_name_text_id").value = "input camera name";
    document.getElementById("region_name_text_id").value = "input region name";
    document.getElementById("file_name_text_id").value = "output_data";
    /*   
       if(window.File && window.FileReader) {
           //File API
           alert("ご使用のブラウザはFile APIを実装しています");
       }else{
           alert("ご使用のブラウザはFile APIをサポートしていません");
       }
   */
    document.getElementById("clear_button_id").onclick = function (e) {

        for (var i = 0; i < lMapPoints.points.length; i++) {
            canvas_map_top.remove(lMapPoints.points[i].circle);
            canvas_map_top.remove(lMapPoints.points[i].text);
        }
        lMapPoints.points.length = 0;
        for (var i = 0; i < lCamPoints.points.length; i++) {
            canvas_cam_top.remove(lCamPoints.points[i].circle);
            canvas_cam_top.remove(lCamPoints.points[i].text);
        }
        lCamPoints.points.length = 0;
    };
    document.getElementById("clear_all_button_id").onclick = function (e) {

        for (var i = 0; i < lMapPoints.points.length; i++) {
            canvas_map_top.remove(lMapPoints.points[i].circle);
            canvas_map_top.remove(lMapPoints.points[i].text);
        }
        lMapPoints.points.length = 0;
        for (var i = 0; i < lCamPoints.points.length; i++) {
            canvas_cam_top.remove(lCamPoints.points[i].circle);
            canvas_cam_top.remove(lCamPoints.points[i].text);
        }
        lCamPoints.points.length = 0;

        for (var i = 0; i < lCameraData.region.length; i++) {
            canvas_map_top.remove(lCameraData.region[i].mapPolygon);
            canvas_cam_top.remove(lCameraData.region[i].camPolygon);
        }
        lCameraData.region.length = 0;
        canvas_map_top.clear().renderAll();
        canvas_cam_top.clear().renderAll();
        initialize();
        initCanvas();
        //setSelectedBgImg();
        form.myfile.value = ""; //json file name, select button            

    };
    document.getElementById("init_button_id").onclick = function (e) {
        window.location.reload(true);
        form.myfile.value = ""; //json file name, select button
    };

    document.getElementById("camera_name_text_id").onclick = function (e) {
        document.getElementById("camera_name_text_id").value = "";
    };

    document.getElementById("region_name_text_id").onclick = function (e) {
        document.getElementById("region_name_text_id").value = "";
    };

    document.getElementById("drawmode_button_id").onclick = function (e) {
        // draw mode on <-> off

        if (canvas_map_top.isDrawingMode == true) {
            document.getElementById("drawmode_button_id").value = "select on";
            canvas_map_top.isDrawingMode = false;
            canvas_cam_top.isDrawingMode = false;
        } else {
            document.getElementById("drawmode_button_id").value = "select off";
            canvas_map_top.isDrawingMode = true;
            canvas_cam_top.isDrawingMode = true;
        }
    };

    document.getElementById("set_polygon_button_id").onclick = function (e) {
        // set polygon data for n region.
        if (lMapPoints.points.length == lCamPoints.points.length) {
            if (lMapPoints.points.length > 1 && lCamPoints.points.length > 1) {
                // Map and Camera, number of circle point is same.
                lCameraData.name = document.getElementById("camera_name_text_id").value;
                lMapPoints.name = document.getElementById("region_name_text_id").value;
                lMapPoints.index = lMapRegionNo;
                drawPolygon(canvas_map_top, lMapPoints, lMapRegionNo, 'blue');
                lMapRegionNo++;
                clearPoints(lMapPoints, lMapRegionNo);

                lCamPoints.name = document.getElementById("region_name_text_id").value;
                lCamPoints.index = lCamRegionNo;
                drawPolygon(canvas_cam_top, lCamPoints, lCamRegionNo, 'blue');
                lCamRegionNo++;
                clearPoints(lCamPoints, lCamRegionNo);
            } else {
                alert("the number of points > 1");
            }
        } else {
            alert("You need to set same number of points on map and camera");
        }
    };
    document.getElementById("file_name_text_id").onclick = function (e) {
        document.getElementById("file_name_text_id").value = "";
    };

    document.getElementById("json_button_id").onclick = function (e) {
        // ここに#buttonをクリックしたら発生させる処理を記述する
        finishRegionData(lCameraNo); // finish the regiondata of cameraXX.
        var intrnlFileName = document.getElementById("file_name_text_id").value + "_internal_data.json";
        saveCameraData(intrnlFileName);
        var jsonFileName = document.getElementById("file_name_text_id").value + ".json";
        saveOutputData(jsonFileName);
    };

    //Form要素を取得する
    var form = document.forms.myform;
    //ファイルが読み込まれた時の処理
    form.myfile.addEventListener('change', function (e) {
        if (lMapFileName == "" || lCamFileName == "") {
            form.myfile.value = ""; //json file name, select button            
            alert("set image data(jpg/png) on map and camera.");
            return;
        }
        initialize();
        if (canvas_map_top == null) {
            canvas_map_top = new fabric.Canvas('cvn_top_map_id');
            canvas_map_top.isDrawingMode = true;
        }
        if (canvas_cam_top == null) {
            canvas_cam_top = new fabric.Canvas('cvn_top_cam_id');
            canvas_cam_top.isDrawingMode = true;
        }

        document.getElementById("drawmode_button_id").value = "select off";
        canvas_map_top.isDrawingMode = true;
        canvas_cam_top.isDrawingMode = true;

        //ここにファイル取得処理を書く
        if (e.target.files.length == 0) {
            alert("can not open the file.");
            return;
        }
        var result = e.target.files[0];

        //FileReaderのインスタンスを作成する
        var reader = new FileReader();

        //読み込んだファイルの中身を取得する
        reader.readAsText(result);

        //ファイルの中身を取得後に処理を行う
        reader.addEventListener('load', function () {
            console.log(reader.result);
            var data = JSON.parse(reader.result);
            setRegionData(0, data.name);
            document.getElementById("camera_name_text_id").value = data.name;
            for (var i = 0; i < data.region.length; i++) {
                //lCameraData.region.push(data.region[i]);
                //lCameraData.region[i].name = data.region[i].name;
                lMapPoints.name = data.region[i].name;
                for (var k = 0; k < data.region[i].mapPoints.length; k++) {
                    if (data.region[i].enable) {
                        drawPoint(canvas_map_top, lMapPoints, data.region[i].mapPoints[k].x, data.region[i].mapPoints[k].y, 'blue');
                    } else {
                        drawPoint(canvas_map_top, lMapPoints, data.region[i].mapPoints[k].x, data.region[i].mapPoints[k].y, 'red');
                    }
                }
                if (data.region[i].enable) {
                    drawPolygon(canvas_map_top, lMapPoints, lMapRegionNo, 'blue');
                } else {
                    drawPolygon(canvas_map_top, lMapPoints, lMapRegionNo, 'red');
                }
                lMapRegionNo++;
                clearPoints(lMapPoints, lMapRegionNo);

                lCamPoints.name = data.region[i].name;
                for (var k = 0; k < data.region[i].camPoints.length; k++) {
                    if (data.region[i].enable) {
                        drawPoint(canvas_cam_top, lCamPoints, data.region[i].camPoints[k].x, data.region[i].camPoints[k].y, 'blue');
                    } else {
                        drawPoint(canvas_cam_top, lCamPoints, data.region[i].camPoints[k].x, data.region[i].camPoints[k].y, 'red');
                    }
                    //                    drawPoint(canvas_cam_top, lCamPoints, data.region[i].camPoints[k].x, data.region[i].camPoints[k].y,'blue');
                }
                //                drawPolygon(canvas_cam_top, lCamPoints, lCamRegionNo, 'blue');
                if (data.region[i].enable) {
                    drawPolygon(canvas_cam_top, lCamPoints, lCamRegionNo, 'blue');
                } else {
                    drawPolygon(canvas_cam_top, lCamPoints, lCamRegionNo, 'red');
                }
                lCamRegionNo++;
                clearPoints(lCamPoints, lCamRegionNo);
            }
            finishRegionData();
        });
    });

    document.getElementById("div_map_img_id").addEventListener("mousedown", function (e) {
        //canvas_map_top,map
        if (canvas_map_top.isDrawingMode) {
            //set clicked point, draw circle.
            drawPoint(canvas_map_top, lMapPoints, e.offsetX, e.offsetY, 'red');
        } else {
            //region enable true or false
            selectRegion(lCameraNo, canvas_map_top, lMapPoints, e.offsetX, e.offsetY);
        }
        console.log("img_map_img_id,mousedown");
    });
    document.getElementById("div_map_img_id").addEventListener("mouseup", function (e) {
        console.log("img_map_img_id,mouseup");
    });
    document.getElementById("div_cam_img_id").addEventListener("mousedown", function (e) {
        //canvas_cam_top,camera
        if (canvas_cam_top.isDrawingMode) {
            //set clicked point, draw circle.
            drawPoint(canvas_cam_top, lCamPoints, e.offsetX, e.offsetY, 'red');
        } else {
            //region enable true or false
            // selectRegion(lCameraNo, canvas_cam_top, lCamPoints, e.offsetX, e.offsetY);
        }
        console.log("img_map_img_id,mousedown");
    });
    document.getElementById("div_cam_img_id").addEventListener("mouseup", function (e) {
        console.log("img_cam_img_id,mouseup");
    });

    //背景Img表示
    canvas_map_bg = document.querySelector('#cvn_bg_map_id');
    var mapCtx = canvas_map_bg.getContext('2d');
    var renderMap = function (image) {
        mapCtx.drawImage(image, 0, 0);
        setImgSize(canvas_map_bg, image);
    }

    canvas_cam_bg = document.querySelector('#cvn_bg_cam_id');
    var camCtx = canvas_cam_bg.getContext('2d');
    var renderCam = function (image) {
        camCtx.drawImage(image, 0, 0);
        setImgSize(canvas_cam_bg, image);
    };

    var cancelEvent = function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    //Drop
    document.addEventListener("dragover", cancelEvent, false);
    document.addEventListener("dragenter", cancelEvent, false);
    document.getElementById("cvn_top_map_id").addEventListener("drop", function (event) {
        event.preventDefault();

        var file = event.dataTransfer.files[0];
        lMapFileName = file.name;
        var image = new Image();
        image.onload = function () {
            renderMap(this);
        };
        var reader = new FileReader();
        reader.onload = function (event) {
            image.src = event.target.result;
            canvas_map_top = new fabric.Canvas('cvn_top_map_id', {
                isDrawingMode: true,
                backgroundColor: 'rgba(250,250,250,0)',
            });
        };
        reader.readAsDataURL(file);
    }, false);
    document.getElementById("cvn_top_cam_id").addEventListener("drop", function (event) {
        event.preventDefault();

        var file = event.dataTransfer.files[0];
        lCamFileName = file.name;

        var image = new Image();
        image.onload = function () {
            renderCam(this);
        };

        var reader = new FileReader();
        reader.onload = function (event) {
            image.src = event.target.result;

            canvas_cam_top = new fabric.Canvas('cvn_top_cam_id', {
                isDrawingMode: true,
                backgroundColor: 'rgba(250,250,250,0)',
            });
        };
        reader.readAsDataURL(file);
    }, false);

}

function removeSplitLastData(src) {
    var value = src.split('/');
    var result = "";
    for (var i = 0; i < value.length - 1; i++) {
        result = result + value[i] + "/";
    }
    return result;
}

function initialize() {
    lMapRegionNo = 0;
    lCamRegionNo = 0;
    lOutputData.region.length = 0;
    lMapPoints.points.length = 0;
    lCamPoints.points.length = 0;
    document.getElementById("drawmode_button_id").disabled = "";
    setRegionData(lCameraNo, "");
    setPointsData(lMapPoints, lMapRegionNo);
    setPointsData(lCamPoints, lCamRegionNo);
}
function initFileName() {
    lMapFileName = "";
    lCamFileName = "";
}
function initCanvas() {
    if (canvas_map_top != null) {
        canvas_map_top.clear().renderAll();
    }
    if (canvas_cam_top != null) {
        canvas_cam_top.clear().renderAll();
    }
}

function setImgSize(canvas, img) {
    if (canvas.id == "cvn_bg_map_id") {
        lBgImgSize.map.width = img.width;
        lBgImgSize.map.height = img.height;
        lBgImgSize.map.naturalWidth = img.naturalWidth;
        lBgImgSize.map.naturalHeight = img.naturalHeight;
    } else if (canvas.id == "cvn_bg_cam_id") {
        lBgImgSize.cam.width = img.width;
        lBgImgSize.cam.height = img.height;
        lBgImgSize.cam.naturalWidth = img.naturalWidth;
        lBgImgSize.cam.naturalHeight = img.naturalHeight;
    }
}

function setPointsData(targetPoints, regionNo) {
    targetPoints.name = "region" + String(regionNo); //"region1", "region2",・・・・
    targetPoints.index = regionNo;
}
function drawPoint(canvas, targetPoints, offsetX, offsetY, color) {
    if (canvas.isDrawingMode == true) {
        var circle = addCircle(canvas, offsetX - 5, offsetY - 5, 5, color);
        var text = setCircleAxis(canvas, offsetX - 5, offsetY - 5, 5);

        var Points = {
            circle: circle,
            text: text,
            focus: true,
        };
        targetPoints.points.push(Points);
    } else {
    }
}
function clearPoints(points, regionNo) {
    points.name = "region" + regionNo;
    points.index = regionNo;
    points.points.length = 0;
}

function drawPolygon(canvas, targetPoints, regionNo, color) {
    var data = [];
    var normData = [];
    for (var i = 0; i < targetPoints.points.length; i++) {
        var circle = addCircle(canvas, targetPoints.points[i].circle.left, targetPoints.points[i].circle.top, 5, color);
        canvas.remove(targetPoints.points[i].circle);
        targetPoints.points[i].circle = circle;
        var points = {
            x: targetPoints.points[i].circle.left + targetPoints.points[i].circle.radius,
            y: targetPoints.points[i].circle.top + targetPoints.points[i].circle.radius
        };
        var normPoints = {
            x: targetPoints.points[i].circle.left + targetPoints.points[i].circle.radius,
            y: targetPoints.points[i].circle.top + targetPoints.points[i].circle.radius
        };
        data.push(points);
        normData.push(normPoints);
    }
    var left = getleft(data);
    var top = gettop(data);
    var polygon = null;
    var text = null;
    var center = { x: 0, y: 0 };
    if (left != null && top != null) {
        polygon = addPolygon(canvas, data, left, top);
        center = getcenter(data);
        text = addText(String(regionNo), canvas, center.x, center.y, 20, 'red');
        targetPoints.points.text = text;
    }
    addRegionData(canvas, polygon, targetPoints, regionNo);
}
function addPolygon(canvas, data, left, top) {
    var polygon = new fabric.Polygon(data, {
        left: left,
        top: top,
        fill: 'rgba(200, 200, 200, 0.5)',
        stroke: 'rgba(255, 0, 0, 0.5)',
        strokeWidth: 3,
        selectable: false
    });
    canvas.add(polygon);
    if (polygon) {
        return polygon;
    } else {
        return null;
    }
}


function setRegionData(camNo, camName) {
    lCameraData.name = camName;
    lCameraData.index = camNo;
    lCameraData.focusRegionNo = 0;
    lCameraData.finish = false;
    lCameraData.region.length = 0;
}
function addRegionData(canvas, polygon, data, regionNo) {
    if (lCameraData.region.length <= regionNo) {
        var region = {
            name: data.name,
            index: regionNo,
            enable: true,
            mapPolygon: null,
            mapPoints: [],
            camPolygon: null,
            camPoints: [],
        };
        lCameraData.region.push(region);
    }
    if (canvas.lowerCanvasEl.id == "cvn_top_map_id") { //map
        lCameraData.region[regionNo].mapPolygon = polygon;
        for (var i = 0; i < data.points.length; i++) {
            lCameraData.region[regionNo].mapPoints.push(data.points[i]);
        }
    } else if (canvas.lowerCanvasEl.id == "cvn_top_cam_id") { //cam
        lCameraData.region[regionNo].camPolygon = polygon;
        for (var i = 0; i < data.points.length; i++) {
            lCameraData.region[regionNo].camPoints.push(data.points[i]);
        }
    }
}
function finishRegionData(camNo) {
    lCameraData.finish = true;
}

function addCircle(canvas, left, top, radius, fill) {
    var circle = new fabric.Circle({
        left: left,
        top: top,
        fill: fill,
        radius: radius
    });

    canvas.add(circle);

    if (circle) {
        return circle;
    } else {
        return null;
    }
}
function removeCircle(canvas, circle) {
    canvas.remove(circle);
}
function setCircleAxis(canvas, left, top, radius) {
    sPoints = "[" + String(left + radius) + "," + String(top + radius) + "]";
    return addText(sPoints, canvas, left + radius * 2, top + radius * 2, 10, 'black');
}
function addText(sInput, canvas, left, top, font_size, color) {
    var text = new fabric.Text(sInput, {
        left: left,
        top: top,
        fontFamily: 'Arial',
        fontSize: font_size,
        fontWeight: 'bold',
        fill: color
    });
    canvas.add(text);
    if (text) {
        return text;
    } else {
        return null;
    }
}

function saveCameraData(fileName) {
    saveJsonData(fileName, lCameraData);
}
function saveOutputData(fileName) {
    tranceCamDataToOutputData(lCameraData);
    saveJsonData(fileName, lOutputData);
    lOutputData.region.length = 0;
}
function saveJsonData(fileName, data) {
    const blob = new Blob([JSON.stringify(data, null, '  ')],
        { type: 'application\/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}
function tranceCamDataToOutputData(data) {
    lOutputData.name = data.name;//"camera" + String(lCameraNo);
    lOutputData.mapFileName = lMapFileName;
    lOutputData.mapWidth = lBgImgSize.map.naturalWidth;
    lOutputData.mapHeight = lBgImgSize.map.naturalHeight;
    lOutputData.camFileName = lCamFileName;
    lOutputData.camWidth = lBgImgSize.cam.naturalWidth;
    lOutputData.camHeight = lBgImgSize.cam.naturalHeight;
    for (var i = 0; i < data.region.length; i++) {
        var region = {
            name: "",
            index: 0,
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
        for (k = 0; k < data.region[i].mapPolygon.points.length; k++) {
            var norm_point = {
                x: data.region[i].mapPolygon.points[k].x / lBgImgSize.map.width, //normalize
                y: data.region[i].mapPolygon.points[k].y / lBgImgSize.map.height //normalize
            };
            region.mapPoints.push(data.region[i].mapPolygon.points[k]);
            //region.mapNormPoints.push(norm_point);
        }
        for (k = 0; k < data.region[i].camPolygon.points.length; k++) {
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

function getleft(data) {
    if (data.length < 1) {
        return null;
    } else if (data.length < 2) {
        return data[i];
    }
    var ret = data[0].x;
    for (var i = 0; i < data.length - 1; i++) {
        if (ret > data[i + 1].x) {
            ret = data[i + 1].x;
        }
    }
    return ret;
}
function getright(data) {
    if (data.length < 1) {
        return null;
    } else if (data.length < 2) {
        return data[i];
    }
    var ret = data[0].x;
    for (var i = 0; i < data.length - 1; i++) {
        if (ret < data[i + 1].x) {
            ret = data[i + 1].x;
        }
    }
    return ret;
}
function gettop(data) {
    if (data.length < 1) {
        return null;
    } else if (data.length < 2) {
        return data[i];
    }
    var ret = data[0].y;
    for (var i = 0; i < data.length - 1; i++) {
        if (ret > data[i + 1].y) {
            ret = data[i + 1].y;
        }
    }
    return ret;
}
function getbottom(data) {
    if (data.length < 1) {
        return null;
    } else if (data.length < 2) {
        return data[i];
    }
    var ret = data[0].y;
    for (var i = 0; i < data.length - 1; i++) {
        if (ret < data[i + 1].y) {
            ret = data[i + 1].y;
        }
    }
    return ret;
}
function getcenter(data) {
    if (data.length < 1) {
        return null;
    }
    ret = { x: 0, y: 0 };
    for (var i = 0; i < data.length; i++) {
        ret.x = ret.x + data[i].x;
        ret.y = ret.y + data[i].y;
    }
    ret.x = ret.x / data.length;
    ret.y = ret.y / data.length;
    return ret;
}


function selectRegion(camenra_no, canvas, targetPoints, x, y) {
    retParam = hitRegion(camenra_no, canvas, x, y);
    if (retParam.enable) {
        console.log("hitRegion");

        for (var i = 0; i < retParam.points.length; i++) {
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
            if (lCameraData.region[retParam.regionNo].enable) {
                circle = addCircle(canvas, left - radius, top - radius, radius, 'red');
            } else {
                circle = addCircle(canvas, left - radius, top - radius, radius, 'blue');
            }
            if (circle) {
                //                canvas.remove(retParam.points[i].circle); circleを共通のパラメータにしないと余計なcircleを残すことになる。今は修正できていない。
                //                targetPoints.points[i].circle = circle;        
            }

        }
        if (lCameraData.region[retParam.regionNo].enable) {
            lCameraData.region[retParam.regionNo].enable = false;
        } else {
            lCameraData.region[retParam.regionNo].enable = true;
        }
    }
}

function hitRegion(camenra_no, canvas, x, y) {
    var retParam = {
        regionNo: 0,
        enable: false,
        points: [],
    };
    var left = 0;
    var right = 0;
    var top = 0;
    var bottom = 0;
    if (canvas.lowerCanvasEl.id == "cvn_top_map_id") { //map
        for (var i = 0; i < lCameraData.region.length; i++) {
            left = getleft(lCameraData.region[i].mapPolygon.points);
            right = getright(lCameraData.region[i].mapPolygon.points);
            top = gettop(lCameraData.region[i].mapPolygon.points);
            bottom = getbottom(lCameraData.region[i].mapPolygon.points);
            if (isHit(left, right, top, bottom, x, y)) {
                retParam.regionNo = i;
                retParam.enable = true;
                retParam.points = lCameraData.region[i].mapPolygon.points;
            }
        }
    } else if (canvas.lowerCanvasEl.id == "cvn_top_cam_id") { //cam
        for (var i = 0; i < lCameraData.region.length; i++) {
            left = getleft(lCameraData.region[i].camPolygon.points);
            right = getright(lCameraData.region[i].camPolygon.points);
            top = gettop(lCameraData.region[i].camPolygon.points);
            bottom = getbottom(lCameraData.region[i].camPolygon.points);
            if (isHit(left, right, top, bottom, x, y)) {
                retParam.regionNo = i;
                retParam.enable = true;
                retParam.points = lCameraData.region[i].camPolygon.points;
            }
        }
    }
    return retParam;
}
function isHit(pos_x1, pos_x2, pos_y1, pos_y2, x, y) {
    if (pos_x1 <= x && x <= pos_x2) {
        if (pos_y1 <= y && y <= pos_y2) {
            var log = "Hit:" + String(pos_x1) + "<=" + String(x) + "<" + String(pos_x2) + ", " + String(pos_y1) + "<=" + String(y) + "<" + String(pos_y2);
            console.log(log);
            return true;
        }
    }
    var log = "noHit:" + String(pos_x1) + "<=" + String(x) + "<" + String(pos_x2) + ", " + String(pos_y1) + "<=" + String(y) + "<" + String(pos_y2);
    console.log(log);
    return false;
}
