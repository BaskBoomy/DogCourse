import { NAVER_MAP_URL } from 'src/helper/url';
import { KakaoBlockId, KakaoBotBasicCard, KakaoBotButton } from 'src/type/kakao/types';
import { Car, NaverSearchResult, NaverTrafficResult, Transport, Walk } from 'src/type/naver/types';

export const MapToTransportResult = (
  param: Transport,
  data,
): NaverTrafficResult => {
  if (data.status == 'POINTS_ARE_TOO_CLOSE' || data.paths.length==0) {
    return {
      isTooClose: true,
      start: param.start,
      goal: param.goal,
      duration: 0,
    };
  } else {
    const short = data.paths[0];
    return {
      isTooClose: false,
      start: param.start,
      goal: param.goal,
      duration: short.duration,
      arrivalTime: short.arrivalTime,
    };
  }
};

export const MapToCarResult = (
  param: Car,
  data,
): NaverTrafficResult => {
  if (data.code !== 0) {
    return {
      isTooClose: true,
      start: param.start,
      goal: param.goal,
      duration: 0,
    };
  } else {
    const short = data.route['3,0,0,0,0,0'][0].summary;
    return {
      isTooClose: false,
      start: param.start,
      goal: param.goal,
      duration: Math.round(short.duration/1000/60),
      arrivalTime: short.arrivalTime,
      taxiFare: short.taxiFare
    };
  }
};

export const MapToWalkResult = (
    param: Walk,
    data,
  ): NaverTrafficResult => {
    const short = data.routes[0].summary;
    return {
    isTooClose: false,
    start: param.l.split(';')[0],
    goal: param.l.split(';')[1],
    duration: Math.round(short.duration/60),
    };
  };
  
export const MapToKakaoTemplateResult = (dog_place:NaverSearchResult,type:string): KakaoBotBasicCard => {
  let buttons: KakaoBotButton[] = [];
  dog_place.phone &&
    buttons.push({
      action: 'phone',
      label: '전화',
      phoneNumber: dog_place.phone,
    });

  buttons.push({
    action: 'block',
    label: '자세히',
    blockId: KakaoBlockId['장소 정보'],
    extra: {
      placeId: String(dog_place.id),
    },
  });
  buttons.push({
    action: 'share',
    label: '공유',
  });
  return {
    title: dog_place.name,
    description: `[${dog_place.workingStatus.status}]\n${dog_place.address}`,
    thumbnail: {
      imageUrl: dog_place.imageURL,
      link: {
        web: NAVER_MAP_URL(type, dog_place.id),
      },
    },
    buttons,
  };
}