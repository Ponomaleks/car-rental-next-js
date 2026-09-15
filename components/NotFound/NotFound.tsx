import Image from 'next/image';
import css from './NotFound.module.css';

interface NoResultsProps {
  onReset: () => void;
  imageSrc?: string;
}

export default function NoResults({
  onReset,
  imageSrc = '/images/not-found.webp',
}: NoResultsProps) {
  const handleReset = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    onReset();
  };

  return (
    <div className={css.container} role="status" aria-live="polite">
      <div className={css.imageWrapper}>
        <Image
          src={imageSrc}
          alt="No cars found"
          fill
          sizes="(max-width: 768px) 300px, 414px"
          priority
          className={css.image}
        />
      </div>
      <h3 className={css.title}>No cars found</h3>
      <p className={css.description}>
        We couldn’t find any cars that match your current filters. Try changing
        your search criteria or reset the filters.
      </p>
      <button
        type="button"
        className="button button_secondary"
        onClick={handleReset}
      >
        Reset filters
      </button>
    </div>
  );
}
