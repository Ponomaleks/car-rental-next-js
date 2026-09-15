'use client';

import { useBodyOverflowHidden } from '../../hooks/useBodyOverflowHidden';
import css from './Loader.module.css';

const Loader = () => {
  useBodyOverflowHidden(false);

  return (
    <div className={css.backdrop}>
      <div className={css.loaderContainer}>
        <div className={css.loader}></div>
        <h3 className={css.loaderText}>Loading...</h3>
        <p className={css.loaderSubText}>
          Please wait while we fetch the best cars for you
        </p>
      </div>
    </div>
  );
};

export default Loader;
