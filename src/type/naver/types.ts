export type NaverSearchParam = {
  currentLat:string;
  currentLng:string;
  type:string;
  address:string;
}
export type NaverMapResult = {
  name:string;
  address:string;
  lat:string;
  lng:string;
  naverMapLink:string;
  transport:NaverTrafficResult,
  car:NaverTrafficResult,
  walk:NaverTrafficResult,
}
export type NaverUrl = {
  type: string;
  url: string;
};
export type NaverImage = {
  type: string;
  url: string;
};

export const NaverOptionId = {
  PARK: 2,
  RESERVATE: 3,
  GROUPSEAT: 13,
  DOGFRIENDLY: 15,
} as const;

export type NaverOption = {
  id: number;
  name: string;
  iconURL: string;
};
export type NaverSearchResult = {
  id: number;
  name: string;
  x: number | undefined;
  y: number | undefined;
  address: string;
  phone?: string;
  description: string;
  urlList: NaverUrl[];
  images: NaverImage[];
  imageURL: string;
  options: NaverOption[];
  naverMapURL: string;
  bizhourInfo: '영업 중' | '곧 영업 종료' | '영업 종료' | '오늘 휴무';
  workingStatus:
    | { id: 1; status: '영업 중' }
    | { id: 2; status: '곧 영업 종료' }
    | { id: 3; status: '영업 종료' }
    | { id: 4; status: '오늘 휴무' };
};
export type QueryParam = {
  [k: string]: any;
};
export type NaverSearchQueryParams = {
  query: string;
  type: string;
  searchCoord: string;
  displayCount: number;
  isPlaceRecommendationReplace: boolean;
  lang: string;
};

export type BizHour = {
  type: string;
  startTime: string;
  endTime: string;
  description: string;
  isDayOff: boolean;
};

export interface NaverTrafficParams {
  key:string;
  start: string;
  goal: string;
  departureTime:string;
  crs: string;
  mode: string;
  rptype: 4;
  cartype: 1;
  fueltype: 1;
  st: 1;
  o: 'all';
  l:string;
  lang: string;
};

export type Transport = Pick<
  NaverTrafficParams,
  'departureTime' |'start' | 'goal' | 'crs' | 'mode' | 'lang'
>;
export type Car = Pick<
  NaverTrafficParams,
  'start' | 'goal' | 'crs' | 'mode' | 'rptype' | 'cartype' | 'fueltype' | 'lang'
>;
export type Walk = Pick<
  NaverTrafficParams,
  'l' | 'st' | 'o' | 'lang'
>;
export type NaverTrafficResult = {
  isTooClose: boolean;
  start: string;
  goal: string;
  duration?: number;
  arrivalTime?: Date;
  taxiFare?:number;
};
export type NaverSearchURLParam = {
  query: string,
  type: string,
  searchCoord : string,
  displayCount: number,
  isPlaceRecommendationReplace: boolean,
  lang: string,
}