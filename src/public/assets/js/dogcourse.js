const { L, C, join } = window._;
function getQueryString(param) {
  return _.go(param, L.entries, L.map(join('=')), join('&'));
}

function updateMarkers(map, markers) {
  var mapBounds = map.getBounds();
  var marker, position;
  for (var i = 0; i < markers.length; i++) {
    marker = markers[i];
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
    const name = document.getElementById('placeName');
    const address = document.getElementById('placeAddress');
    const phone = document.getElementById('phoneLink');
    const share = document.getElementById('shareLink');
    const naverMap = document.getElementById('naverMapLink');
    const placeLink = document.getElementById('placeLink');
    const imageSlideBox = document.getElementById('imageSlideBox');

    name.innerText = trafficInfoData[seq - 1].name;
    address.innerText = trafficInfoData[seq - 1].address;
    phone.href = 'tel:' + trafficInfoData[seq - 1].phone;
    share.href = trafficInfoData[seq - 1].shareLink;
    naverMap.href = trafficInfoData[seq - 1].naverMapLink;
    placeLink.href = trafficInfoData[seq - 1].shareLink;

    while (imageSlideBox.firstChild) {
      imageSlideBox.removeChild(imageSlideBox.firstChild);
    }
    for (const imageUrl of trafficInfoData[seq - 1].images) {
      let imgTag = document.createElement('img');
      imgTag.src = imageUrl;
      imgTag.className = 'place-info-box-img';
      imageSlideBox.appendChild(imgTag);
    }

    var marker = markers[seq],
      infoWindow = infoWindows[seq];
    if (infoWindow.getMap()) {
      infoWindow.close();
      document.getElementById('placeInfoBox').style.display = 'none';
    } else {
      infoWindow.open(map, marker);
      document.getElementById('placeInfoBox').style.display = 'flex';
    }
  };
}

//Geolocation으로 현재 위치 파악
function getCurrentPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
async function getTrafficInfo(currentLat, currentLng, type, address) {
  const param = { currentLat, currentLng, type, address };
  const response = await fetch(
    `https://api.dogcourse.net/place/getTrafficInfo`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    },
  );
  return response.json();
}

let markers = [],infoWindows = [];
let map;
let trafficInfoData;
getCurrentPosition().then(({ coords }) => {
  map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(centerLat, centerLng),
    zoom: 15,
  });
  let position = new naver.maps.LatLng(coords.latitude, coords.longitude);
  let marker = new naver.maps.Marker({
    map: map,
    position: position,
    title: '내위치',
    icon: {
      url: 'assets/imgs/map-me.png',
      size: new naver.maps.Size(37, 37),
      anchor: new naver.maps.Point(15, 37),
    },
    zIndex: 100,
  });

  let infoWindow = new naver.maps.InfoWindow({
    content:
      '<div style="width:150px;text-align:center;padding:10px;">내위치</div>',
  });

  markers.push(marker);
  infoWindows.push(infoWindow);

  getTrafficInfo(coords.latitude, coords.longitude, type, address).then(
    (trafficInfos) => {
      trafficInfoData = trafficInfos;
      for (const info of trafficInfos) {
        let position = new naver.maps.LatLng(info.lat, info.lng);

        let marker = new naver.maps.Marker({
          map: map,
          position: position,
          title: info.name,
          icon: {
            url: 'assets/imgs/map-37.png',
            size: new naver.maps.Size(37, 37),
            anchor: new naver.maps.Point(15, 37),
          },
          zIndex: 100,
        });
        //차 : 자동차 시간,예상 택시비
        //대중교통 : 시간, 도착시간 (duration 0이면 도착시간 없음)
        //도보 : 시간
        let infoWindow = new naver.maps.InfoWindow({
          content: `
                        <div class="marker-box">
                            <div class="marker-box-top">
                                <div class="title">${info.name}</div>
                                <div class="small-red">${info.status}</div>
                            </div>
                            <div class="marker-box-middle">
                                <div class="time-box">
                                    <img class="time-icon" alt="icon" src="assets/imgs/dog-32.png"/>
                                    <div class="time">${info.walk.duration}분</div>
                                </div>
                                <div class="time-box">
                                    <img class="time-icon" alt="icon" src="assets/imgs/car-32.png">
                                    <div class="time">${info.car.duration}분</div>
                                </div>
                                <div class="time-box">
                                    <img class="time-icon" alt="icon" src="assets/imgs/bus-32.png"/>
                                    <div class="time">${info.transport.duration}분</div>
                                </div>
                            </div>
                            <div class="marker-box-bottom">${info.options}</div>
                        </div>`,
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
      }

      naver.maps.Event.addListener(map, 'idle', function () {
        updateMarkers(map, markers);
      });

      for (let i = 0, ii = markers.length; i < ii; i++) {
        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
      }
      document.getElementById('loader').style.display = 'none';
    },
  );
});
