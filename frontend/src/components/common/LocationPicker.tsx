import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AimOutlined } from '@ant-design/icons';
import { ObjectType } from '../../types';
import { applyRussianLabels, createObjectBadge, isWebglAvailable, MAP_STYLE_URL, MOSCOW_CENTER } from './mapShared';

type Props = {
  lat?: number;
  lng?: number;
  type?: ObjectType;
  onChange: (coords: { lat: number; lng: number }) => void;
};

const round6 = (value: number) => Math.round(value * 1e6) / 1e6;

const LocationPicker: React.FC<Props> = ({ lat, lng, type, onChange }) => {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [mapFailed, setMapFailed] = useState(!isWebglAvailable());

  const hasPoint = typeof lat === 'number' && typeof lng === 'number';

  useEffect(() => {
    if (mapFailed || !container.current) return;

    let instance: maplibregl.Map;
    try {
      instance = new maplibregl.Map({
        container: container.current,
        style: MAP_STYLE_URL,
        center: hasPoint ? [lng!, lat!] : MOSCOW_CENTER,
        zoom: hasPoint ? 14 : 9.5,
        attributionControl: false,
      });
    } catch (error) {
      // Без карты координаты всё ещё можно ввести в поля формы вручную.
      console.error('Не удалось инициализировать карту выбора расположения:', error);
      setMapFailed(true);
      return;
    }
    map.current = instance;

    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    instance.on('style.load', () => applyRussianLabels(instance));
    instance.on('click', e => onChangeRef.current({ lat: round6(e.lngLat.lat), lng: round6(e.lngLat.lng) }));
    instance.getCanvas().style.cursor = 'crosshair';

    return () => {
      instance.remove();
      map.current = null;
      marker.current = null;
    };
  }, [mapFailed]);

  // Маркер следует и за кликом по карте, и за ручным вводом координат в полях формы.
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;

    if (!hasPoint) {
      marker.current?.remove();
      marker.current = null;
      return;
    }

    const position: [number, number] = [lng!, lat!];

    if (!marker.current) {
      marker.current = new maplibregl.Marker({
        element: createObjectBadge({ type, label: 'Выбранное расположение объекта' }),
        anchor: 'center',
        draggable: true,
      })
        .setLngLat(position)
        .addTo(instance);

      marker.current.on('dragend', () => {
        const { lat: dragLat, lng: dragLng } = marker.current!.getLngLat();
        onChangeRef.current({ lat: round6(dragLat), lng: round6(dragLng) });
      });
    } else {
      marker.current.setLngLat(position);
    }

    if (!instance.getBounds().contains(position)) {
      instance.easeTo({ center: position, duration: 400 });
    }
  }, [lat, lng, hasPoint]);

  // Смена типа объекта меняет рисунок внутри значка.
  useEffect(() => {
    if (!marker.current) return;
    const element = marker.current.getElement();
    const fresh = createObjectBadge({ type, label: 'Выбранное расположение объекта' });
    element.innerHTML = fresh.innerHTML;
  }, [type]);

  if (mapFailed) {
    return (
      <div className="location-picker">
        <div className="location-picker__map map-fallback">
          <div className="map-fallback__title">Карта недоступна в этом браузере</div>
          <div className="map-fallback__text">
            Для карты нужен WebGL. Координаты объекта можно указать вручную в полях широты и долготы.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="location-picker">
      <div ref={container} className="location-picker__map" />
      <div className="location-picker__hint">
        <AimOutlined />
        {hasPoint
          ? 'Кликните по карте или перетащите значок, чтобы уточнить расположение'
          : 'Кликните по карте, чтобы указать расположение объекта'}
      </div>
    </div>
  );
};

export default LocationPicker;
