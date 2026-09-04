import React from 'react';
import LoginPage from './LoginPage';

/**
 * Register Page
 * Opens the unified auth page with the Register Household tab pre-selected.
 */
export default function RegisterPage() {
  return <LoginPage defaultRegister={true} />;
}
