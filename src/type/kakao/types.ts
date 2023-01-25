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
