export const SAMPLE_CLASS_IMGS = [
  {
    imgSrc:
      'https://ui.shadcn.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1528143358888-6d3c7f67bd5d%3Fw%3D300%26dpr%3D2%26q%3D80&w=640&q=75',
    name: 'piano-A',
  },
  {
    imgSrc:
      'https://ui.shadcn.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1611348586804-61bf6c080437%3Fw%3D300%26dpr%3D2%26q%3D80&w=640&q=75',
    name: 'piano-B',
  },
  {
    imgSrc:
      'https://ui.shadcn.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1468817814611-b7edf94b5d60%3Fw%3D300%26dpr%3D2%26q%3D80&w=640&q=75',
    name: 'violine-A',
  },
  {
    imgSrc:
      'https://ui.shadcn.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1513745405825-efaf9a49315f%3Fw%3D300%26dpr%3D2%26q%3D80&w=384&q=75',
    name: 'violine-B',
  },
];

export const OCEAN_BACK_IMGS = [
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_RichardBarnden_05.jpg',
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_FrancoisBaelen_15.jpg',
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_JakeWilton_03.jpg',
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_GregoryPiper_38.jpg',
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_SimonHilbourne_01.jpg',
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_ThomasHorig_13.jpg',
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_ThomasHorig_27.jpg',
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_JeffHester_05.jpg',
  'https://d2zmi9say0r1yj.cloudfront.net/OceanImageBank_LewisBurnett_05.jpg',
];

export const getRandomOceanImage = () => {
  const randomIndex = Math.floor(Math.random() * OCEAN_BACK_IMGS.length);
  return OCEAN_BACK_IMGS[randomIndex];
};
