export type NaverUrl = {
  type: string;
  url: string;
};
export type NaverImage = {
  type: string;
  url: string;
};

export const NaverOptionId = {
  PARK:2,
  RESERVATE:3,
  GROUPSEAT:13,
  DOGFRIENDLY:15
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
  images: NaverImage;
  imageURL: string;
  options: NaverOption[];
  naverMapURL: string;
  bizhourInfo:
    {id:1;status:'영업 중'} | {id:2;status:'곧 영업 중료'} | {id:3;status:'영업 종료'} | {id:4; status:'오늘 휴무'};
};
export type QueryParam = {
  [k:string]:any;
}
export type NaverSearchQueryParams = {
  query: string;
  type: string;
  searchCoord: string;
  displayCount: number;
  isPlaceRecommendationReplace: boolean;
  lang: string;
}

export type BizHour = {
  type:string;
  startTime:string;
  endTime:string;
  description:string;
  isDayOff:boolean;
}
