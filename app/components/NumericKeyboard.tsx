import { DeleteIcon } from 'lucide-react';
import React from 'react';
import HeartAnimation from './HeartAnimation/HeartAnimation';

interface NumericKeyboardProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onChangeDigits: (value: string) => void;
}

const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3];

const NumericKeyboard: React.FC<NumericKeyboardProps> = ({
  inputValue,
  setInputValue,
  onChangeDigits,
}) => {
  const handleRemove = () => {
    setInputValue((prev) => {
      const value = prev.slice(0, -1);
      onChangeDigits(value);
      return value;
    });
  };

  const handleClickNumbers = (number: number) => {
    setInputValue((prev) => {
      const value = (prev + number).slice(0, 4);

      onChangeDigits(value);
      return value;
    });
  };

  const handleClickZero = () =>
    setInputValue((prev) => {
      const value = (prev + '0').slice(0, 4);
      onChangeDigits(value);
      return value;
    });

  const numberButtons = numbers.map((number) => (
    <button
      key={number}
      type='button'
      className='bg-gray-200 p-3 rounded text-lg font-semibold hover:bg-gray-300'
      onClick={() => handleClickNumbers(number)}
    >
      {number}
    </button>
  ));

  return (
    <div className='flex flex-col items-center w-full mb-4'>
      <input
        type='text'
        name='4digits'
        value={inputValue}
        className='border-2 border-gray-300 p-2 text-center text-lg w-full mb-4'
        placeholder='핸드폰번호 끝 4자리'
        readOnly
      />
      <div className='grid grid-cols-3 gap-4 w-full'>
        {numberButtons}

        <HeartAnimation
          className='p-3 rounded text-lg font-semibold mx-auto'
          fill='red'
          stroke='red'
        />

        <button
          type='button'
          className='bg-gray-200 p-3 rounded text-lg font-semibold hover:bg-gray-300'
          onClick={handleClickZero}
        >
          0
        </button>
        <button
          type='button'
          className='bg-red-200 p-3 rounded text-lg font-semibold hover:bg-red-300'
          onClick={handleRemove}
        >
          <DeleteIcon className='mx-auto' />
        </button>
      </div>
    </div>
  );
};

export default NumericKeyboard;
