'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './join-group-form.module.css';

const JoinGroupForm = () => {
  const [group_id, setGroupId] = useState('');
  const [user_name, setUserName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!group_id || !user_name || !phone_number) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`/api/groups/${group_id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name, phone_number }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join group');
      }

      // Store user info in localStorage
      localStorage.setItem('userName', user_name);
      localStorage.setItem('phoneNumber', phone_number);

      // Redirect to the group page
      router.push(`/groups/${group_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Join a Group</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="group_id" className={styles.label}>Group ID:</label>
          <input
            type="text"
            id="group_id"
            value={group_id}
            onChange={(e) => setGroupId(e.target.value)}
            className={styles.input}
            placeholder="Enter group ID"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="user_name" className={styles.label}>Your Name:</label>
          <input
            type="text"
            id="user_name"
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
            className={styles.input}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone_number" className={styles.label}>Phone Number:</label>
          <input
            type="tel"
            id="phone_number"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={styles.input}
            placeholder="Enter your phone number"
            required
          />
          <small className={styles.helpText}>Format: +1234567890 or 123-456-7890</small>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submitButton}>Join Group</button>
      </form>
    </div>
  );
};

export default JoinGroupForm;