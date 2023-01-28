import { quickReplies } from 'src/type/kakao/response_datas';
export type KakaoBotThumbnail = {
  imageUrl: string;
  link?:{web:string};
};
type KaKaoBotActionType = 'webLink' | 'phone' | 'share' | 'message' | 'block';
export type KakaoBotButton = {
  action: KaKaoBotActionType;
  label: string;
  webLinkUrl?: string | undefined;
  messageText?: string;
  phoneNumber?: string;
  blockId?: string;
};
export type KakaoBotPetFriendlyResult = {
  title: string;
  description: string;
  thumbnail: KakaoBotThumbnail;
  buttons: KakaoBotButton[];
};

export type KakaoTemplateOutput = {
  carousel?:{type:string,items:KakaoBotPetFriendlyResult[]};
  simpleText?: {text:string};
}

export type QuickReply = {
  label:string;
  action:string;
  blockId:string;
  extra:{type:string,address:string};
}
export type KakaoTemplate = {
  outputs:KakaoTemplateOutput[];
  quickReplies?:QuickReply[];
}
export type KakaoResponseBody = {
  version:string;
  template:KakaoTemplate;
}
