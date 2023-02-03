const { L, C, join} = window._;
function getQueryString(param){
    return _.go(
        param,
        L.entries,
        L.map(join('=')),
        join('&')
    )
}

function updateMarkers(map, markers) {

    var mapBounds = map.getBounds();
    var marker, position;

    for (var i = 0; i < markers.length; i++) {

        marker = markers[i]
        position = marker.getPosition();

        if (mapBounds.hasLatLng(position)) {
            showMarker(map, marker);
        } else {
            hideMarker(map, marker);
        }
    }
}

function showMarker(map, marker) {

    if (marker.setMap()) return;
    marker.setMap(map);
}

function hideMarker(map, marker) {

    if (!marker.setMap()) return;
    marker.setMap(null);
}

// 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandler(seq) {
    return function (e) {
        var marker = markers[seq],
            infoWindow = infoWindows[seq];

        if (infoWindow.getMap()) {
            infoWindow.close();
        } else {
            infoWindow.open(map, marker);
        }
    }
}

//Geolocation으로 현재 위치 파악
function getCurrentPosition() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}
async function getTrafficInfo(params) {
    const response = await fetch(`http://api.dogcourse.net/place/getTrafficInfo`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body : JSON.stringify(params)
        });
    return response.json();
}