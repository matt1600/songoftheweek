'use client';
import React, { useState, ChangeEvent } from 'react';

export default function CustomInput() {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    const filtered = input.replace(/[^A-Z0-9_]/g, '');
    setValue(filtered);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Only A-Z, 0-9, _"
      className="border p-2 rounded"
    />
  );
}