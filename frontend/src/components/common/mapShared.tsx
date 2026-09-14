import React from 'react';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { renderToStaticMarkup } from 'react-dom/server';
import { ObjectType, Status } from '../../types';
import { objectTypeMeta, STATUS_META } from '../../objectTypes';

// Адрес воркера MapLibre вычисляет в рантайме через import.meta.url, из-за чего
// сборщик не видит этот файл и не кладёт его в бандл — карта остаётся пустой.
// Передаём адрес явно, тогда воркер попадает в сборку вместе с зависимостями.
maplibregl.setWorkerUrl(maplibreWorkerUrl);

// MapLibre рисует карту только через WebGL и бросает исключение, если контекст
// недоступен (старые корпоративные ПК, удалённый рабочий стол, отключённое
// аппаратное ускорение). Проверяем заранее, чтобы показать заглушку.
export const isWebglAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

export const MOSCOW_CENTER: [number, number] = [37.6173, 55.7558];

// Стиль подписывает объекты латиницей и кириллицей в две строки — оставляем только русское название.
export const applyRussianLabels = (map: maplibregl.Map) => {
  for (const layer of map.getStyle()?.layers ?? []) {
    if (layer.type !== 'symbol') continue;
    const textField = (layer.layout as Record<string, unknown> | undefined)?.['text-field'];
    if (!textField || !JSON.stringify(textField).includes('name')) continue;
    map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:ru'], ['get', 'name']]);
  }
};

export const createObjectBadge = (options: { type?: ObjectType; status?: Status; label?: string }) => {
  const { Icon, label } = objectTypeMeta(options.type);
  const status = options.status ? STATUS_META[options.status] : null;

  const el = document.createElement('div');
  el.className = `map-pin${options.status ? ` map-pin--${options.status}` : ''}`;
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', options.label ?? label);
  el.innerHTML =
    `<span class="map-pin__body">${renderToStaticMarkup(<Icon />)}</span>` +
    (status ? `<span class="map-pin__status" style="background:${status.color}"></span>` : '');
  return el;
};
