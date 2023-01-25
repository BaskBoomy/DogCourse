export type NaverUrl = {
  type: string;
  url: string;
};
export type NaverImage = {
  type: string;
  url: string;
};
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
