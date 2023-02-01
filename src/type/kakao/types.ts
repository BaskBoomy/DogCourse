type KaKaoBotActionType = 'webLink' | 'phone' | 'share' | 'message' | 'block';

export const KakaoBlockId = {
  '장소 정보' : '63d8c637c4105b65e9124c06',
} as const;

export type KakaoBotThumbnail = {
  imageUrl: string;
  link?:{web?:string;pc?:string;mobile?:string};
  fixedRatio?:boolean;
  width?:number;
  height?:number;
};
export type KakaoBotButton = {
  action: KaKaoBotActionType;
  label: string;
  webLinkUrl?: string | undefined;
  messageText?: string;
  phoneNumber?: string;
  blockId?: string;
  extra?:{
    [k:string]:string;
  }
};
export type KakaoBotBasicCard = {
  title?: string;
  description?: string;
  thumbnail: KakaoBotThumbnail;
  buttons?: KakaoBotButton[];
};


export type KakaoOutput = {
  carousel?:{
    type:string;
    items:KakaoBotBasicCard[] | KakaoBotBasicCard[]
  };
  simpleText?: {text:string};
  simpleImage?: {imageUrl:string;altText:string;};
  basicCard?:KakaoBotBasicCard;
}

export type QuickReply = {
  label:string;
  action:string;
  blockId?:string;
  extra?:{type:string,address:string};
  messageText?:string;
}
export type KakaoTemplate = {
  outputs:KakaoOutput[];
  quickReplies?:QuickReply[];
}
export type KakaoResponseBody = {
  version:string;
  template:KakaoTemplate;
}
export type KaKaoChatBotParam = {
  intent:{
    id:string;
    name:string;
  };
  action:{
    params:{
      type?:string;
      address?:string;
      placeId?:string;
    },
    clientExtra?:{
      [k:string]:string;
    }
  }
}
