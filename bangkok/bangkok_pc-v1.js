//import maplibregl from 'maplibre-gl';
//import 'maplibre-gl/dist/maplibre-gl.css';
//import 'https://unpkg.com/maplibre-gl@5.0.1/dist/maplibre-gl.css';     
//import 'https://unpkg.com/maplibre-gl@5.0.1/dist/maplibre-gl.js';
//import "https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js"

const map = new maplibregl.Map({
    container: 'map',
    center: [100.64, 13.75],
    zoom: 9.5,
//   minZoom: 7,
    maxZoom: 18,
    style: {
        version: 8,
        sources: {
            osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                maxzoom: 19,
                tileSize: 256,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
            // 人口と駅までの距離レイヤ
            popsta: {
                type: 'geojson',
//                data: './bangkok/polygon1km_pop-dis.geojson',
                data: `${location.href.replace('index.html','')}bangkok/polygon1km_pop-dis.geojson`,            
                attribution: '<a href="https://data.humdata.org/dataset/worldpop-population-density-for-thailand">Thailand-Population Density</a>',
            },
            // 人口変化レイヤ
            popchg:{
                type: 'geojson',
 //               data: './bangkok/bangkok_pop_diff_16-20_final.geojson',
                data: `${location.href.replace('index.html','')}bangkok/bangkok_pop_diff_16-20_final.geojson`,
                attribution: '<a href="https://data.humdata.org/dataset/worldpop-population-density-for-thailand">Thailand-Population Density</a>',
            },

            // railway data from OSM
            railway: {
                type: 'geojson',
    //          data: './bangkok/railway.geojson',
                data: `${location.href.replace('index.html','')}bangkok/railway.geojson`,               
                attribution: '<a href="https://data.humdata.org/dataset/hotosm_tha_railways">Thailand Railways (OpenStreetMap Export)</a>',
            },
            // station with near busstops   
            station2bus: {
                type: 'geojson',
 //               data: './bangkok/dist_rst2bsp_sl.geojson',
                data: `${location.href.replace('index.html','')}bangkok/dist_rst2bsp_sl.geojson`,               
                attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },

 /*           station: {
                type: 'geojson',
                data: './bangkok/hotosm_tha_railways_points.geojson',
                attribution: '<a href="https://data.humdata.org/dataset/hotosm_tha_railways">Thailand Railways (OpenStreetMap Export)</a>',
            }, */

            // bus stop
            busstop: {
                type: 'geojson',
//                data: './bangkok/light_busstop_bangkok_metro.geojson',
                data: `${location.href.replace('index.html','')}bangkok/light_busstop_bangkok_metro.geojson`,              
                attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },

            // nearest bus stop to station
            nearbsp: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [],
                },
            },
            // bus route
            busroute: {
                type: 'geojson',
//                data: './bangkok/light_bus-route.geojson',
                data: `${location.href.replace('index.html','')}bangkok/light_bus-route.geojson`,               
                attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
            //  population value layer
            poplav: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [],
                },
            },
        },
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        layers: [
            {
                id: 'osm-layer',
                source: 'osm',
                type: 'raster',
            },
            {
                id: 'pop-station-Layer',
                source: 'popsta',
                type: 'fill',
                paint: {
                    'fill-color': [
 /*                       'interpolate',
                        ['linear'],
                        ['get', 'z'],
                        0,
                        '#ffffff',
                        100,
                        '#ffcccc',
                        1000,
                        '#ffaaaa',
                        5000,
                        '#ff8888',
                        10000,
                        '#ff6666',
                        30000,
                        '#ff0000' */
                        'interpolate',
                        ['exponential',1],
                        ['get','z'],
//                        ['zoom'],
                        200,
//                        10,
                        '#ffdddd',
//                        30000,
                        20000,
                        '#ff0000'                      
                    ],
                    'fill-opacity': 0.5,
                },
                layout: { visibility: "visible" },
            },
            {
                id: 'pop-change-Layer',
                source: 'popchg',
                type: 'fill',
                paint: {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'z'],
                        -315,
                        'rgb(145,224,236)',
                        -10,
                        'rgb(210,232,236)',
                        0,
                        'rgb(255,255,255)',
                        100,
                        'rgb(255,212,212)',
                        500,
                        'rgb(255,170,170)',
                        1500,
                        'rgb(255,128,128)',
                        2000,
                        'rgb(255,85,85)',
                        2500,
                        'rgb(255,0,0)'                   
                    ],
                    'fill-opacity': 0.5,
                },
                layout: { visibility: "none" },
                
            },
            {
                id: 'railway-Layer',
                source: 'railway',
                type: 'line',
                paint: {
                    'line-color': '#000000',
                    'line-width': 1,
                },
            },

            {
                id: 'busroute-Layer',
                source: 'busroute',
                type: 'line',
                paint: {
                    'line-color': '#00ffff',
                    'line-width': 4,
                    'line-opacity': 0,
                },
                layout: { visibility: "visible" },
                //               filter:['==',['get','ref'], '1-73']
                filter: ['none'],
            },
            {
                id: 'populav-Layer',
                source: 'poplav',
                type: 'symbol',
                layout: {
                    'text-field': ['get', 'iz'],
                    'text-size': 12,
                },
                paint: {
                    'text-color': '#0000cd',
                },
            },

            {
                id: 'busstop-Layer',
                source: 'busstop',
                type: 'circle',
                minzoom: 11,
                paint: {
                    'circle-color': '#00ff00',
                    'circle-radius': 3,
                },
            },
            {
                id: 'station2bus-Layer',
                source: 'station2bus',
                type: 'circle',
                paint: {
                    'circle-color': '#0000ff',
                    'circle-radius': 3,
                },
            },
 /*           {
                id: 'station-Layer',
                source: 'station',
                type: 'circle',
                paint: {
                    'circle-color': '#ff0000',
                    'circle-radius': 6,
                },
                layout: { visibility: "none" }, // this data is not used
            }, */

            {
                id: 'nearbsp-Layer',
                source: 'nearbsp',
                type: 'circle',
                paint: {
                    'circle-color': '#ff0000',
                    'circle-radius': 6,
                },
            },
        ],
    },

});


//
const layonoff1 = document.getElementById("osm-layer");
const layonoff2 = document.getElementById("pop-station-Layer");
const layonoff3 = document.getElementById("railway-Layer");
const layonoff4 = document.getElementById("station2bus-Layer");
const layonoff5 = document.getElementById("pop-change-Layer");


// ズームレベルを取得
var currentZoom = map.getZoom();
console.log('Current Zoom Level:', currentZoom);


var buspoint;
var nbstopx
var nbstopy
let blref=[]

//----- 3/16 add -----
let popvLayer='pop-station-Layer'
let featuresList=[];

      // ズームレベルを表示する要素を取得
const zoomLevelElement = document.getElementById('zoom-level');

      // ズームレベルの表示を更新する関数
function updateZoomLevel() {
    const zoomLevel = map.getZoom();
    zoomLevelElement.textContent = `Zoom Level: ${zoomLevel.toFixed(2)}`;
}

// function to show population ineach mesh

const getFeaturesList= (pvfeatures) => {
    if (pvfeatures.length > 0) {

        featuresList=[];
        pvfeatures.forEach(pvfeature => {

            var popv = pvfeature.geometry.coordinates[0]
            var popvx = (pvfeature.geometry.coordinates[0][0][0]+pvfeature.geometry.coordinates[0][1][0])/2;
            var popvy =(pvfeature.geometry.coordinates[0][0][1]+pvfeature.geometry.coordinates[0][2][1])/2;
            var popvz = pvfeature.properties.z;
            var ipopvz=Math.round(popvz);

//    console.log('pop value:', ipopvz);

            const popvFeature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [popvx,popvy],
                },
                properties:{
                    iz:ipopvz,
                },
            };

// Add each feature to the features list
            featuresList.push(popvFeature);
        });
    }
    return featuresList;
};

// -- 3/16 add owari ---

// action to the map
map.on('load', () => {
    let pvfeatures=[];
    /*  pup for population information
    
        map.on('click',(e) => {
            // check whether pop data exists
            const features = map.queryRenderedFeatures(e.point,{
                   layers: [
                    'pop-station-Layer',
                ],
            });
            const popfeas =map.queryRenderedFeatures({layers: ['pop-station-Layer',]});
    
            if (features.length == 0) {
     
                return;
            };
     //         else alert('clicked!');
            const feature = features[0];
            var pop_d=feature.properties.z;
            var rpop_d=Math.round(pop_d);
            var dis2s=feature.properties.dis2;
            var rdis2s=Math.round(dis2s);
            const popup = new maplibregl.Popup()
     //             .setLngLat(feature.geometry.coordinates)
                  .setLngLat(e.lngLat)
                  .setHTML(
                      `\
                    <div> population density: ${pop_d}
                    </div>\
                     <div> rounded population density: ${rpop_d} /km2
                    </div>\   
                   <div> distance to station: ${feature.properties.dis2}</div>\                          
                  <div> rounded distance to station: ${rdis2s} m</div>`,
                  )
                  .addTo(map);
        });
    */

    // マウスカーソルがポイントに移動したときの処理
    map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['station2bus-Layer'],
        });
        if (features.length > 0) {
            map.getCanvas().style.cursor = 'pointer';
            const feature = features[0];
            nbstopx = feature.properties.X1;
            nbstopy = feature.properties.Y1;

            console.log('feature.length:', features.length);

            const nesbspFeature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [nbstopx, nbstopy],
                },
            };
            map.getSource('nearbsp').setData({
                type: 'FeatureCollection',
                features: [nesbspFeature],
            });
        } else {
            map.getCanvas().style.cursor = '';
            map.getSource('nearbsp').setData({
                type: 'FeatureCollection',
                features: [],
            });
        }
    });

    map.on('click', (e) => {
        var flength = map.querySourceFeatures('nearbsp').length;
        console.log('nearbsp:', flength);
 //       if (flength > 0 & situ == 1) {
        if (flength > 0) {
            const bfeatures = map.querySourceFeatures('busroute');
//            const bfeatures = map.queryRenderedFeatures('busroute');
            let bpoint = [nbstopx, nbstopy];
            console.log('point coordinate:', [nbstopx, nbstopy]);
            //           console.log('bfeatures[0].id:', bfeatures[0].properties.id); 

            let closestFeature = null;
            let minDistance = Infinity;

            bfeatures.forEach(feature => {
                if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
                    // 各ラインフィーチャとの最短距離を計算
                    const line = feature.geometry.coordinates;
                    console.log('line:', line);
                    //           const distance = turf.pointToLineDistance(point, feature.geometry);
                    const distance = turf.pointToLineDistance(bpoint, line);

                    // 最短距離のラインを選択
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestFeature = feature;
                    }
                }
            });

            if (closestFeature) {
                console.log('最も近いラインフィーチャ:', closestFeature);
                console.log('距離', minDistance);
                blref = closestFeature.properties.ref;
                console.log('ref', blref);
                map.setFilter('busroute-Layer', ['==', 'ref', blref]);
                map.setPaintProperty('busroute-Layer', 'line-opacity', 1);
            } else {
                console.log('ラインが見つかりませんでした');
            }
        }

    });

    // population annotation layer generation   

        map.on('zoom', (e) => {
        
            if (layonoff2.checked==true) {
                popvLayer='pop-station-Layer';
            } else {
                popvLayer='pop-change-Layer';
            }
 //           pvfeatures = map.queryRenderedFeatures(e.point,{layers:['pop-station-Layer']});
            pvfeatures = map.queryRenderedFeatures(e.point,{layers:[popvLayer]});

 //        const pvfeatures = map.querySourceFeatures('popsta');
            currentZoom = map.getZoom();
        //        console.log('Current Zoom Level:', currentZoom);
            if (currentZoom > 12 & currentZoom <15) {
                featuresList=getFeaturesList(pvfeatures);
                map.getSource('poplav').setData({
                    type: 'FeatureCollection',
                    features: featuresList,  
                });
        
            }  else if (currentZoom < 12 || currentZoom > 15) {
                featuresList=[];
                map.getSource('poplav').setData({
                    type: 'FeatureCollection',
                    features: featuresList,  
                });   
            }

            // smaller point size for station when zoom level is low 
            let radius;
            if (currentZoom < 11){
                radius = 3;
            } else if (currentZoom >11) {
                radius = 4;
            }

            map.setPaintProperty('station2bus-Layer','circle-radius',radius)

            if (currentZoom < 10.5) {
                map.setPaintProperty('busroute-Layer', 'line-opacity', 0);
            } else if (currentZoom > 10.5 & blref.length!=0) {
                map.setPaintProperty('busroute-Layer', 'line-opacity', 1);
            }
        });  

        map.on('move', (e) => {

            if (layonoff2.checked==true) {
                popvLayer='pop-station-Layer';
            } else {
                popvLayer='pop-change-Layer';
            }            
    //        pvfeatures = map.queryRenderedFeatures(e.point,{layers:['pop-station-Layer']});
            pvfeatures = map.queryRenderedFeatures(e.point,{layers:[popvLayer]});

    //        const pvfeatures = map.querySourceFeatures('popsta');
            currentZoom = map.getZoom();
        //        console.log('Current Zoom Level:', currentZoom);
            if (currentZoom > 12 & currentZoom <15) {
                featuresList=getFeaturesList(pvfeatures);
                map.getSource('poplav').setData({
                    type: 'FeatureCollection',
                    features: featuresList,  
                });
        
            }  else if (currentZoom < 12 || currentZoom > 15) {
                featuresList=[];
                map.getSource('poplav').setData({
                    type: 'FeatureCollection',
                    features: featuresList,  
                });   
            }
        });        
        
    });

/*
* チェックボックスのオンオフを元に、レイヤの表示/非表示を切り替えます
*/


      // チェックボックスの変更に応じて他のチェックボックスも操作する関数
function updateCheckboxes(checkboxId) {
        // すべてのチェックボックスを取得
    const checkboxes = ['pop-station-Layer', 'pop-change-Layer'];

    checkboxes.forEach(id => {
          if (id !== checkboxId) {
            const checkbox = document.getElementById(id);
            // チェックボックスの状態を反転させる
            checkbox.checked = document.getElementById(checkboxId).unchecked;
        }
    });
}

/*
const layonoff1 = document.getElementById("osm-layer");
const layonoff2 = document.getElementById("pop-station-Layer");
const layonoff3 = document.getElementById("railway-Layer");
const layonoff4 = document.getElementById("station2bus-Layer");
const layonoff5 = document.getElementById("pop-change-Layer");
*/

layonoff1.addEventListener('click', () => {
    if (layonoff1.checked == true) {
        map.setLayoutProperty("osm-layer", "visibility", "visible");
        //       alert(" check box of chenged to on");
    } else {
        map.setLayoutProperty("osm-layer", "visibility", "none");
        //        alert(" check box chenged to off");    
    }
});
layonoff2.addEventListener('click', () => {
    if (layonoff2.checked == true) {
        map.setLayoutProperty("pop-station-Layer", "visibility", "visible");
        map.setLayoutProperty("pop-change-Layer", "visibility", "none");
        updateCheckboxes('pop-station-Layer');
    } else {
        // チェックボックスのチェックが外れた場合、レイヤを非表示にする
        map.setLayoutProperty("pop-station-Layer", "visibility", "none");
    }
});
layonoff5.addEventListener('click', () => {
    if (layonoff5.checked == true) {
        map.setLayoutProperty("pop-change-Layer", "visibility", "visible");
        map.setLayoutProperty("pop-station-Layer", "visibility", "none");
        updateCheckboxes('pop-change-Layer');
    } else {
            // チェックボックスのチェックが外れた場合、レイヤを非表示にする
        map.setLayoutProperty("pop-change-Layer", "visibility", "none");
    }
});
layonoff3.addEventListener('click', () => {
    if (layonoff3.checked == true) {
        map.setLayoutProperty("railway-Layer", "visibility", "visible");
    } else {
        map.setLayoutProperty("railway-Layer", "visibility", "none");
    }
});
layonoff4.addEventListener('click', () => {
    if (layonoff4.checked == true) {
        map.setLayoutProperty("station2bus-Layer", "visibility", "visible");
    } else {
        map.setLayoutProperty("station2bus-Layer", "visibility", "none");
    }
});

// % popultion for set distance level 

const calButton = document.getElementById('calculation');
calButton.addEventListener('click', () => {
    //   alert('Button pushed');
    const popfeas = map.queryRenderedFeatures({ layers: ['pop-station-Layer',] });
    //   alert (popfeas.length);

    const thrnumber = parseInt(document.getElementById('thr-number').value); //Threshold
    //    alert ('thr-number='+thrnumber);

    var setcnt = [];
    let i;
    var id_num; var id_num2;
    var pop_d2; var dis22s;
    var total_p = 0; var ac_p = 0;

    for (i = 0; i < 1877; i++) {
        setcnt[setcnt.length] = 0;
    };
    for (i = 0; i < popfeas.length; i++) {
        //               for (i =0; i < 3;i++) {
        const popfea = popfeas[i];
        id_num = popfea.properties.pid - 1;
        pop_d2 = popfea.properties.z;
        dis22s = popfea.properties.dis2;
        setcnt[id_num] = setcnt[id_num] + 1;
        //          alert (setcnt[id_num]+':'+id_num);
        if (setcnt[id_num] < 2) {
            total_p = total_p + pop_d2;
            total_p = total_p;
            if (dis22s < thrnumber) { ac_p = ac_p + pop_d2; }
        }
        else if (setcnt[id_num] > 1) {
            id_num2 = id_num + 1;
            //                      alert ('id:'+id_num2+setcnt[id_num]);
        };
    };

    var ratio = Math.round(1000 * ac_p / total_p) / 10;
    document.getElementById('tot-pop').value = Math.round(total_p);
    document.getElementById('acc-pop').value = Math.round(ac_p);
    document.getElementById('per-pop').value = ratio;

    //   alert ('finish'+i);
    //   alert ('*** population who live less than '+thrnumber+' m *** \n' +Math.round(ac_p) + '\n'+ '*** total population:*** \n'+Math.round(total_p)+'\n' +ratio+' %');

});

document.getElementById("toggle-legend").addEventListener("click", function () {
    var overlay = document.querySelector(".map-overlay");

    // 現在の表示状態を確認し、切り替える
    if (overlay.style.display === "none") {
        overlay.style.display = "block";  // 表示する
        document.getElementById("toggle-legend").innerText = "off"; // ボタンの文字を変更
    } else {
        overlay.style.display = "none";  // 非表示にする
        document.getElementById("toggle-legend").innerText = "on"; // ボタンの文字を変更
    }
}); 

// ズームレベルが変更されるたびに更新
map.on('zoom', updateZoomLevel);

// 初期表示を設定
updateZoomLevel();
