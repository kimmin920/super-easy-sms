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

export type DayInString =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface Class {
  id: string;
  name: string;
  coverImgSrc: string;
  teacher: string;
  description: string;
  price: number;
  priceDescription: string;
  scheduledDays: DayInString[];
  classCount: number;
  // numberOfClass: number;
  // pricePerClass: number;
  billingFrequency: string;
}

export const allClasses: Class[] = [
  {
    id: 'piano-a',
    name: 'Piano-A',
    coverImg: SAMPLE_CLASS_IMGS[0].imgSrc,
    teacher: 'hyunkyung kim',
    description: '',
    price: 100000,
    priceDescription: '/월',
    days: ['Monday', 'Wednesday'],
    numberOfClass: 12,
    pricePerClass: 16000,
  },
  {
    id: 'piano-b',
    name: 'Piano-B',
    coverImg: SAMPLE_CLASS_IMGS[1].imgSrc,
    teacher: 'hyunkyung kim',
    description: '',
    price: 200000,
    priceDescription: '/월',
    days: ['Monday', 'Wednesday'],
    numberOfClass: 4,
    pricePerClass: 20000,
  },
  {
    id: 'violine-a',
    name: 'Violine-A',
    coverImg: SAMPLE_CLASS_IMGS[2].imgSrc,
    teacher: 'hyunkyung kim',
    description: '',
    price: 300000,
    priceDescription: '/월',
    days: ['Monday'],
    numberOfClass: 1,
    pricePerClass: 50000,
  },
  {
    id: 'violine-b',
    name: 'Violine-B',
    coverImg: SAMPLE_CLASS_IMGS[3].imgSrc,
    teacher: 'hyunkyung kim',
    description: '',
    price: 400000,
    priceDescription: '/회',
    days: ['Wednesday', 'Thursday'],
    numberOfClass: 8,
    pricePerClass: 25000,
  },
  {
    id: 'guitar-c',
    name: 'Guitar-C',
    coverImg: SAMPLE_CLASS_IMGS[3].imgSrc,
    teacher: 'hyunkyung kim',
    description: '',
    price: 400000,
    priceDescription: '/회',
    days: ['Wednesday', 'Thursday'],
    numberOfClass: 8,
    pricePerClass: 25000,
  },
  {
    id: 'guitar-d',
    name: 'Guitar-D',
    coverImg: SAMPLE_CLASS_IMGS[3].imgSrc,
    teacher: 'hyunkyung kim',
    description: '',
    price: 400000,
    priceDescription: '/회',
    days: ['Wednesday', 'Thursday'],
    numberOfClass: 8,
    pricePerClass: 25000,
  },
];
