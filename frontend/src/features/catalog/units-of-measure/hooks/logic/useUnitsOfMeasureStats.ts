import { useMemo } from 'react';
import type { UnitOfMeasure, UomStats } from '../../types';

export function useUnitsOfMeasureStats(uoms: UnitOfMeasure[]): UomStats {
  return useMemo<UomStats>(() => {
    let active = 0;
    let inactive = 0;
    let allowDecimals = 0;
    let integersOnly = 0;

    for (const uom of uoms) {
      if (uom.isActive) {
        active++;
      } else {
        inactive++;
      }

      if (uom.allowDecimals) {
        allowDecimals++;
      } else {
        integersOnly++;
      }
    }

    return {
      total: uoms.length,
      active,
      inactive,
      allowDecimals,
      integersOnly,
    };
  }, [uoms]);
}

