export type NaverUrl = {
  type: string;
  url: string;
};
export type NaverImage = {
  type: string;
  url: string;
};

// const PARK= 2;
// const RESERVATE = 3;
// const GROUPSEAT = 13;
// const DOGFRIENDLY = 15;
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
};

export type NaverSearchQueryParams = {
  query: string;
  type: string;
  search_coordinate: string;
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