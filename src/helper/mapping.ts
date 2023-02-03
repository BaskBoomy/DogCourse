import { Car, NaverTrafficParams, NaverTrafficResult, Transport, Walk } from 'src/type/naver/types';

export const MapToTransportResult = (
  param: NaverTrafficParams,
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
  param: NaverTrafficParams,
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
    param: NaverTrafficParams,
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
  