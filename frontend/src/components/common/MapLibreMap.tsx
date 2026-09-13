import React, { useRef, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '../../store';
import { Object as AppObject } from '../../types';
import { objectTypeMeta, STATUS_META } from '../../objectTypes';
import { applyRussianLabels, createObjectBadge, MAP_STYLE_URL, MOSCOW_CENTER } from './mapShared';

const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );

const buildMarkerElement = (obj: AppObject) => {
  const { label } = objectTypeMeta(obj.type);
  const status = STATUS_META[obj.status] ?? STATUS_META.green;
  const el = createObjectBadge({
    type: obj.type,
    status: obj.status,
    label: `${label} «${obj.name}» — ${status.label}`,
  });
  el.dataset.objectId = obj.id;
  return el;
};

const buildPopupHtml = (obj: AppObject) => {
  const { label } = objectTypeMeta(obj.type);
  const status = STATUS_META[obj.status] ?? STATUS_META.green;
  return `
    <div class="map-popup">
      <div class="map-popup__type">${escapeHtml(label)}</div>
      <div class="map-popup__name">${escapeHtml(obj.name)}</div>
      <div class="map-popup__address">${escapeHtml(obj.address)}</div>
      <div class="map-popup__meta">
        <span class="map-popup__status" style="--status-color:${status.color}">${escapeHtml(status.label)}</span>
        <span>Устройств: ${obj.devices?.length ?? 0}</span>
      </div>
    </div>`;
};

// Пересоздание маркера закрывает открытый попап, поэтому трогаем только изменившиеся объекты.
const objectSignature = (obj: AppObject) =>
  [obj.name, obj.type, obj.status, obj.address, obj.lat, obj.lng, obj.devices?.length ?? 0].join('|');

const MapLibreMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef(new Map<string, { marker: maplibregl.Marker; signature: string }>());
  const didFitBounds = useRef(false);
  const { objects } = useStore();

  useEffect(() => {
    if (!mapContainer.current) return;

    const instance = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE_URL,
      center: MOSCOW_CENTER,
      zoom: 9.5,
      attributionControl: false,
    });
    map.current = instance;

    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    instance.on('style.load', () => applyRussianLabels(instance));

    return () => {
      instance.remove();
      markers.current.clear();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;

    const seen = new Set(objects.map(obj => obj.id));
    markers.current.forEach((entry, id) => {
      if (seen.has(id)) return;
      entry.marker.remove();
      markers.current.delete(id);
    });

    for (const obj of objects) {
      const signature = objectSignature(obj);
      const existing = markers.current.get(obj.id);
      if (existing?.signature === signature) continue;
      existing?.marker.remove();

      const marker = new maplibregl.Marker({ element: buildMarkerElement(obj), anchor: 'center' })
        .setLngLat([obj.lng, obj.lat])
        .setPopup(new maplibregl.Popup({ offset: 26, closeButton: false }).setHTML(buildPopupHtml(obj)))
        .addTo(instance);
      markers.current.set(obj.id, { marker, signature });
    }

    if (!didFitBounds.current && objects.length > 0) {
      const bounds = objects.reduce(
        (acc, obj) => acc.extend([obj.lng, obj.lat] as maplibregl.LngLatLike),
        new maplibregl.LngLatBounds([objects[0].lng, objects[0].lat], [objects[0].lng, objects[0].lat])
      );
      instance.fitBounds(bounds, { padding: 80, maxZoom: 12, duration: 0 });
      didFitBounds.current = true;
    }
  }, [objects]);

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-canvas" />
      <div className="map-legend">
        {(Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map(key => (
          <span key={key} className="map-legend__item">
            <i className="map-legend__dot" style={{ background: STATUS_META[key].color }} />
            {STATUS_META[key].label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MapLibreMap;
