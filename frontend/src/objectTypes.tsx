import React from 'react';
import { ObjectType, Status } from './types';

type GlyphProps = { className?: string; style?: React.CSSProperties };

const glyph = (children: React.ReactNode) => {
  const Glyph: React.FC<GlyphProps> = ({ className, style }) => (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
  return Glyph;
};

// Водопроводный кран — общий знак водоснабжения
const TapGlyph = glyph(
  <>
    <rect x="7.4" y="2.2" width="9.2" height="2.6" rx="1.3" />
    <rect x="10.7" y="3.6" width="2.6" height="3.6" />
    <rect x="8.4" y="6.4" width="7.2" height="2" rx="0.7" />
    <path d="M3.4 9.2h14.4a1.2 1.2 0 0 1 1.2 1.2v3.4h-3.2v-1.6H7.3v8.4H3.4z" />
    <circle cx="5.35" cy="22" r="1.6" />
  </>
);

// Резервуар — цилиндрическая ёмкость
const TankGlyph = glyph(
  <>
    <ellipse cx="12" cy="5.5" rx="7" ry="2.6" />
    <path d="M5 7.5V18c0 1.44 3.13 2.6 7 2.6s7-1.16 7-2.6V7.5c0 1.44-3.13 2.6-7 2.6S5 8.94 5 7.5z" />
  </>
);

// Очистные сооружения — фильтр-воронка
const FilterGlyph = glyph(
  <>
    <path d="M3.4 4h17.2l-6.8 8v8.4l-3.6-2V12z" />
  </>
);

// Склад — ангар с воротами
const WarehouseGlyph = glyph(
  <>
    <path fillRule="evenodd" d="M12 3.4 21.4 9V21H2.6V9zM8.8 12.6h6.4V21H8.8z" />
  </>
);

// Офис — административное здание
const OfficeGlyph = glyph(
  <>
    <path
      fillRule="evenodd"
      d="M3.6 2.6h10.8V9H21v12.4H3.6zm2.6 3v2.2h2.2V5.6zm4.6 0v2.2h2.2V5.6zm-4.6 5v2.2h2.2v-2.2zm4.6 0v2.2h2.2v-2.2zm-4.6 5v2.2h2.2v-2.2zm4.6 0v2.2h2.2v-2.2zm6 -3.4v2.2h2.2v-2.2zm0 4.6v2.2h2.2v-2.2z"
    />
  </>
);

// Вышка связи — мачта с сигналом
const TowerGlyph = glyph(
  <>
    <circle cx="12" cy="7.4" r="2.1" />
    <path d="M11 10h2l3.2 11.4h-2.2l-.7-2.8h-2.6l-.7 2.8H7.8z" />
    <path
      d="M7.6 3.6a6.4 6.4 0 0 0 0 7.6M16.4 3.6a6.4 6.4 0 0 1 0 7.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </>
);

// Терминал — приёмный узел
const TerminalGlyph = glyph(
  <>
    <path fillRule="evenodd" d="M2.6 5.6h18.8v12.8H2.6zm3.2 2.4v8h1.8V8zm4.3 0v8h1.8V8zm4.3 0v8h1.8V8z" />
  </>
);

// Прочее — капля воды
const DropGlyph = glyph(
  <>
    <path d="M12 2.4s-6.6 7.3-6.6 11.4a6.6 6.6 0 0 0 13.2 0C18.6 9.7 12 2.4 12 2.4z" />
  </>
);

export const OBJECT_TYPE_META: Record<ObjectType, { label: string; Icon: React.ComponentType<GlyphProps> }> = {
  pumping: { label: 'Насосная станция', Icon: TapGlyph },
  reservoir: { label: 'Резервуар', Icon: TankGlyph },
  treatment: { label: 'Очистные сооружения', Icon: FilterGlyph },
  warehouse: { label: 'Склад', Icon: WarehouseGlyph },
  office: { label: 'Офис', Icon: OfficeGlyph },
  tower: { label: 'Вышка связи', Icon: TowerGlyph },
  terminal: { label: 'Терминал', Icon: TerminalGlyph },
  other: { label: 'Прочее', Icon: DropGlyph },
};

export const STATUS_META: Record<Status, { label: string; color: string }> = {
  green: { label: 'Норма', color: '#16A34A' },
  yellow: { label: 'Предупреждение', color: '#F59E0B' },
  red: { label: 'Критично', color: '#DC2626' },
};

export const objectTypeMeta = (type?: ObjectType) => OBJECT_TYPE_META[type ?? 'other'] ?? OBJECT_TYPE_META.other;
