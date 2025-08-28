import React from 'react';

export default function Modal({ open, onClose, title, children, tone = 'neutral' }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`modal ${tone}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}