import React from 'react';

function roleBadge(title) {
  const t = title.toLowerCase();
  if (t.includes('executive council') || t.includes('member')) return { label: 'MEC', color: 'var(--badge-blue,#0b54a6)' };
  if (t.includes('head of department') || t.includes('head')) return { label: 'HOD', color: 'var(--badge-orange,#ff8c42)' };
  if (t.includes('financial') || t.includes('chief financial')) return { label: 'CFO', color: 'var(--badge-green,#10b981)' };
  return { label: 'STAFF', color: 'var(--badge-gray,#64748b)' };
}

export default function ExecCard({ exec }) {
  const badge = roleBadge(exec.title);
  // ensure grayscale variant for the portrait (Unsplash supports &grayscale)
  const imgUrl = exec.image.includes('unsplash') && !exec.image.includes('grayscale') ? `${exec.image}&grayscale=1` : exec.image;

  return (
    <article className="exec-card">
      <div className="exec-image" style={{ backgroundImage: `url(${imgUrl})` }}>
        <span className="role-badge" style={{ background: badge.color }}>{badge.label}</span>
      </div>
      <div className="exec-body">
        <h3>{exec.name}</h3>
        <p className="role">{exec.title}</p>
        <div className="exec-actions">
          <a className="btn primary" href={`mailto:${exec.email}`}>E Email</a>
          <a className="btn outline" href={`tel:${exec.phone}`}>Phone</a>
        </div>
      </div>
    </article>
  );
}

