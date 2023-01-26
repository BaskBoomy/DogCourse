export const textResponse = {
  NOPLACE:
    "근처에 반려동물 동반 가능한 장소가 없습니다. 😢\n아래 메뉴를 확인하여 주소를 다시 입력해주세요.",
} as const;

export const quickReplies = {
  DEFAULT: [
    {
      label: "방배동 카페",
      action: "block",
      blockId: "63d0c9786a284e067805a902",
      extra: {
        type: "방배동",
        address: "카페",
      },
    },
    {
      label: "역삼동 카페",
      action: "block",
      blockId: "63d0c9786a284e067805a902",
      extra: {
        type: "역삼동",
        address: "카페",
      },
    },
    {
      label: "서래마을 음식점",
      action: "block",
      blockId: "63d0c9786a284e067805a902",
      extra: {
        type: "서래마을",
        address: "음식점",
      },
    },
    {
      label: "가평 카페 추천",
      action: "block",
      blockId: "63d0c9786a284e067805a902",
      extra: {
        type: "가평",
        address: "카페",
      },
    },
  ],
};
