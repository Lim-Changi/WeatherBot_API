export const GreetingType = {
  0: '폭설이 내리고 있어요.',
  1: '눈이 포슬포슬 내립니다.',
  2: '폭우가 내리고 있어요.',
  3: '비가 오고 있습니다.',
  4: '날씨가 약간은 칙칙해요.',
  5: '따사로운 햇살을 맞으세요.',
  6: '날이 참 춥네요.',
  7: '날씨가 참 맑습니다.',
} as const;

export type GreetingType = typeof GreetingType[keyof typeof GreetingType];

export const TemperatureType = {
  0: '어제보다 n도 덜 덥습니다. ',
  1: '어제보다 n도 더 덥습니다. ',
  2: '어제보다 n도 덜 춥습니다. ',
  3: '어제보다 n도 더 춥습니다. ',
  4: '어제와 비슷하게 덥습니다. ',
  5: '어제와 비슷하게 춥습니다. ',
  6: '최고기온은 n도, ',
  7: '최저기온은 n도 입니다. ',
} as const;

export type TemperatureType =
  typeof TemperatureType[keyof typeof TemperatureType];

export const HeadsUpType = {
  0: '내일 폭설이 내릴 수도 있으니 외출 시 주의하세요.',
  1: '눈이 내릴 예정이니 외출 시 주의하세요.',
  2: '폭우가 내릴 예정이에요. 우산을 미리 챙겨두세요.',
  3: '며칠동안 비 소식이 있어요.',
  4: '날씨는 대체로 평온할 예정이에요.',
} as const;

export type HeadsUpType = typeof HeadsUpType[keyof typeof HeadsUpType];
