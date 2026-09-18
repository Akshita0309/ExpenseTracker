import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <div className="page-sub">Your account details</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 420 }}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <div>{user?.name}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <div>{user?.email}</div>
        </div>
      </div>
    </div>
  );
}
