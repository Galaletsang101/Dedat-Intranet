import React from 'react';

export default function Timeline({ items = [] }) {
  return (
    <div className="timeline">
      {items.map((it) => (
        <div className="timeline-item" key={it.year}>
          <div className="year">{it.year}</div>
          <div className="desc">{it.text || it.desc}</div>
        </div>
      ))}
    </div>
  );
}
