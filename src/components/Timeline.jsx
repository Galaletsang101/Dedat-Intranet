import React from 'react';

const items = [
  { year: '1994', desc: 'Department Establishment — Formation of the provincial economic portfolio following South Africa’s transition to democracy.' },
  { year: '2010', desc: 'Tourism Master Plan Launch — A comprehensive 20-year strategic initiative.' },
  { year: '2018', desc: 'Special Economic Zone Activation — Launch of the Upington Industrial Park and SEZ commitments.' },
  { year: '2024', desc: 'New Growth Strategy — Adoption of the 2024-2030 Integrated Economic Growth Strategy.' },
];

export default function Timeline() {
  return (
    <div className="timeline">
      {items.map((it) => (
        <div className="timeline-item" key={it.year}>
          <div className="year">{it.year}</div>
          <div className="desc">{it.desc}</div>
        </div>
      ))}
    </div>
  );
}
