import { useState } from 'react';
import './styles.css';

type Props = {
  className?: string;
};

function HeartAnimation({ className }: Props) {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    if (liked) {
      return;
    }

    setLiked(true);
    setTimeout(() => setLiked(false), 400);
  };

  return (
    <>
      <button onClick={toggleLike} className={className}>
        ❤️
        {liked && <div className='heart-animation'>❤️</div>}
      </button>
    </>
  );
}

export default HeartAnimation;
