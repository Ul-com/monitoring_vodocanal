import React from 'react';
import { Tag } from 'antd';
import { Status } from '../../types';

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const colorMap = {
    green: 'success',
    yellow: 'warning',
    red: 'error',
  };
  const labelMap = {
    green: 'Норма',
    yellow: 'Предупреждение',
    red: 'Критично',
  };
  return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
};

export default StatusBadge;