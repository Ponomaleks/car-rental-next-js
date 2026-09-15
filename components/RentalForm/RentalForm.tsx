'use client';

import { string, object, ObjectSchema, ValidationError } from 'yup';
import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

import css from './RentalForm.module.css';
import { submitRental } from '@/lib/api';
import { RentalFormData } from '@/types/car';
import { useRentalFormStore } from '@/lib/store/rentalStore';
import { useCreateRentalMutation } from '@/hooks/useCreateRentalMutation';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface RentalFormProps {
  carId: number;
}

interface ErrorState {
  name?: string;
  email?: string;
  comment?: string;
}

const RentalFormSchema: ObjectSchema<RentalFormData> = object({
  name: string()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name is too long')
    .matches(/^[\p{L}][\p{L}\s'-]{1,}$/u, 'Please enter your name.')
    .required('Name is required'),
  email: string()
    .email('Please enter your email.')
    .required('Email is required'),
  comment: string()
    .max(300, 'Comment is too long')
    .required('Comment is required'),
});

export default function RentalForm({ carId }: RentalFormProps) {
  const [error, setError] = useState<ErrorState>({});
  const {
    draft: { name, email, comment },
    setDraft,
    clearDraft,
  } = useRentalFormStore();

  const {
    handleCreateRental,
    isLoading,
    isError,
    isSuccess,
    error: mutationError,
    data,
  } = useCreateRentalMutation({
    createNoteFn: submitRental,
  });

  const formAction = async (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as RentalFormData;

    try {
      await RentalFormSchema.validate(values, { abortEarly: false });
      setError({});

      handleCreateRental(carId, values);

      if (isSuccess) {
        toast.success(
          data?.message || 'Rental request submitted successfully!',
        );
        clearDraft();
      }
      if (isError) {
        toast.error(
          mutationError?.message ||
            'An error occurred while submitting the rental request.',
        );
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationErrors: ErrorState = {};

        err.inner.forEach(validationError => {
          if (validationError.path) {
            validationErrors[validationError.path as keyof ErrorState] =
              validationError.message;
          }
        });

        setError(validationErrors);
      }
    }
  };

  const handleBlur = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    RentalFormSchema.validateAt(name, { [name]: value })
      .then(() => {
        setError(prevError => ({ ...prevError, [name]: undefined }));
        setDraft({ [name]: value });
      })
      .catch(err => {
        setError(prevError => ({ ...prevError, [name]: err.message }));
        console.error(`Validation error for ${name}:`, err.message);
      });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (error[name as keyof ErrorState]) {
      handleBlur(e);
    } else {
      setDraft({ [name]: value });
    }
  };

  return (
    <form className={css.rentalForm} action={formAction} aria-busy={isLoading}>
      <h2 className={css.formHeader}>Book your car now</h2>
      <p className={css.formDescription}>
        Stay connected! We are always ready to help you.
      </p>
      <div className={clsx(css.formGroup, error?.name && css.error)}>
        <label className={clsx(css.label, css.inputLabel)} htmlFor="name">
          Name*
        </label>
        <input
          id="name"
          type="text"
          placeholder="Name*"
          name="name"
          className={css.input}
          defaultValue={name}
          autoComplete="name"
          aria-invalid={Boolean(error?.name)}
          aria-describedby={error?.name ? 'name-error' : undefined}
          onBlur={e => handleBlur(e)}
          onChange={e => handleChange(e)}
        />
        <FiInfo className={css.errorIcon} />
        {error?.name && (
          <span id="name-error" className={css.errorMessage} role="alert">
            {error.name}
          </span>
        )}
      </div>
      <div className={clsx(css.formGroup, error?.email && css.error)}>
        <label className={clsx(css.label, css.inputLabel)} htmlFor="email">
          Email*
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email*"
          name="email"
          className={css.input}
          defaultValue={email}
          autoComplete="email"
          aria-invalid={Boolean(error?.email)}
          aria-describedby={error?.email ? 'email-error' : undefined}
          onBlur={e => handleBlur(e)}
          onChange={e => handleChange(e)}
        />
        <FiInfo className={css.errorIcon} />
        {error?.email && (
          <span id="email-error" className={css.errorMessage} role="alert">
            {error.email}
          </span>
        )}
      </div>

      <div className={clsx(css.formGroup, error?.comment && css.error)}>
        <label className="visually-hidden" htmlFor="comment">
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          className={css.textarea}
          placeholder="Comment"
          defaultValue={comment}
          aria-invalid={Boolean(error?.comment)}
          aria-describedby={error?.comment ? 'comment-error' : undefined}
          onBlur={e => handleBlur(e)}
          onChange={e => handleChange(e)}
        />
        <FiInfo className={css.errorIcon} />
        {error?.comment && (
          <span id="comment-error" className={css.errorMessage} role="alert">
            {error.comment}
          </span>
        )}
      </div>
      <button
        type="submit"
        className={clsx(css.submitButton, 'button button_primary')}
        disabled={isLoading}
      >
        Send
      </button>
    </form>
  );
}
