import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <strong>Sri Lanka Power & Water Cut Alert and Reporting System</strong>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Built for SLIIT SE3090 Software Engineering Frameworks — Mini Hackathon 2026
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Crafted with</span>
          <Heart size={14} color="#ef4444" fill="#ef4444" />
          <span>for the citizens of Sri Lanka</span>
        </div>
      </div>
    </footer>
  );
}
