export interface Student {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  classes: string[];
}

export const students: Student[] = [
  {
    id: '1',
    name: 'Elon',
    lastName: 'Musk',
    email: 'vv@cc',
    phoneNumber: '01097690373',
    classes: ['piano-a', 'violine-b', 'guitar-c', 'guitar-d'],
  },
  {
    id: '2',
    name: 'Jeff',
    lastName: 'Bezos',
    email: 'vv@cc',
    phoneNumber: '01097690373',
    classes: ['piano-b', 'violine-a'],
  },
];
