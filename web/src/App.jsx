import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './validation';
import { submitEvaluation } from './api';
import Modal from './Modal';
import './styles.css';
import logo from './vault-logo.png';

export default function App() {
  const [modal, setModal] = useState({ open: false, title: '', message: '', tone: 'neutral' });
  const [busy, setBusy] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_first: '',
      name_last: '',
      address_line_1: '',
      address_line_2: '',
      address_city: '',
      address_state: '',
      address_postal_code: '',
      address_country_code: 'US',
      document_ssn: '',
      email_address: '',
      birth_date: ''
    }
  });

  const openModal = (title, message, tone='neutral') => setModal({ open: true, title, message, tone });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  async function onSubmit(values) {
    setBusy(true);
    try {
      const res = await submitEvaluation(values);
      const outcome = res?.outcome ?? 'Approved';

      if (outcome === 'Approved') {
        openModal('Approved!', 'Your Vault is now unlocked 🔓', 'success');
        reset();
      } else if (outcome === 'Manual Review') {
        openModal('Pending Review', "Your application is in the Vault review process. We’ll follow up shortly.", 'info');
      } else if (outcome === 'Denied') {
        openModal('Not Approved', 'Thanks for applying, but your Vault application did not meet our requirements.', 'error');
      } else {
        openModal('Received', `Outcome: ${outcome}`, 'info');
      }
    } catch (err) {
      const list = err?.details?.details;
      const serverMsg = err?.message || 'Submission failed';
      openModal('Submission error', (
        <>
          <p>{serverMsg}</p>
          {Array.isArray(list) && list.length > 0 && (
            <>
              <p>Fix the following:</p>
              <ul>{list.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </>
          )}
        </>
      ), 'error');
    } finally {
      setBusy(false);
    }
  }

  function normalizeState(e) { setValue('address_state', e.target.value.toUpperCase()); }
  function onlyDigitsSSN(e) { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9); }

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo" height="28" />
        <h1>VAULT</h1>
        <h4>Credit Application</h4>
      </header>

      <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid">
          <Field label="First Name" error={errors.name_first?.message}>
            <input {...register('name_first')} />
          </Field>
          <Field label="Last Name" error={errors.name_last?.message}>
            <input {...register('name_last')} />
          </Field>
          <Field label="Address Line 1" error={errors.address_line_1?.message} colSpan={2}>
            <input {...register('address_line_1')} />
          </Field>
          <Field label="Address Line 2" error={errors.address_line_2?.message} colSpan={2}>
            <input {...register('address_line_2')} />
          </Field>
          <Field label="City" error={errors.address_city?.message}>
            <input {...register('address_city')} />
          </Field>
          <Field label="State" error={errors.address_state?.message}>
            <input {...register('address_state')} maxLength={2} onInput={normalizeState} />
          </Field>
          <Field label="Zip Code" error={errors.address_postal_code?.message}>
            <input {...register('address_postal_code')} inputMode="numeric" />
          </Field>
          <Field label="Country" error={errors.address_country_code?.message}>
            <input {...register('address_country_code')} readOnly />
          </Field>
          <Field label="SSN (9 digits)" error={errors.document_ssn?.message}>
            <input {...register('document_ssn')} inputMode="numeric" onInput={onlyDigitsSSN} maxLength={9} />
          </Field>
          <Field label="Email Address" error={errors.email_address?.message}>
            <input {...register('email_address')} type="email" />
          </Field>
          <Field label="DOB" error={errors.birth_date?.message}>
            <input {...register('birth_date')} placeholder="YYYY-MM-DD" />
          </Field>
        </div>

        <button type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Submit'}</button>
      </form>

      <Modal open={modal.open} onClose={closeModal} title={modal.title} tone={modal.tone}>
        {modal.message}
      </Modal>
    </div>
  );
}

function Field({ label, error, children, colSpan }) {
  return (
    <div className={`field ${colSpan === 2 ? 'col-span-2' : ''}`}>
      <label>{label}</label>
      {children}
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}
