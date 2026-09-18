import React from 'react';
import { formatDate } from '../utils/formatDate';

export default function AlertCard({ alert, onMarkRead }) {
  return (
    <div className={`alert-item${!alert.isRead ? ' unread' : ''}`}>
      <div className="alert-message">
        <div>{alert.message}</div>
        <div className="alert-time">{formatDate(alert.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
      </div>
      {!alert.isRead && (
        <button className="icon-btn" onClick={() => onMarkRead(alert.id)}>Mark read</button>
      )}
    </div>
  );
}
