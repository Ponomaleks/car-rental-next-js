"use client";

import { useState } from "react";

import { submitRental } from "@/lib/api";

interface RentalFormProps {
  carId: number;
}

export function RentalForm({ carId }: RentalFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    rentalDate: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await submitRental({
        carId,
        ...form,
      });

      setSuccessMessage("Rental request sent successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        rentalDate: "",
        comment: "",
      });
    } catch {
      setErrorMessage("Failed to submit rental request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rental-form" onSubmit={handleSubmit}>
      <h2>Book your car now</h2>
      <input
        type="text"
        placeholder="Name"
        required
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
      />
      <input
        type="tel"
        placeholder="Phone"
        required
        value={form.phone}
        onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
      />
      <input
        type="date"
        required
        value={form.rentalDate}
        onChange={(event) => setForm((prev) => ({ ...prev, rentalDate: event.target.value }))}
      />
      <textarea
        placeholder="Comment"
        value={form.comment}
        onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
      />
      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send"}
      </button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
}
