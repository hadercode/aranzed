import type {
  CSSProperties,
  FC,
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export type StaticTableAlign = "left" | "center" | "right";

export interface StaticTableColumnHeader {
  key?: string;
  label?: ReactNode;
  align?: StaticTableAlign;
  width?: string | number;
  minWidth?: string | number;
  className?: string;
  style?: CSSProperties;
}

export interface StaticTableProps
  extends Omit<HTMLAttributes<HTMLTableElement>, "children"> {
  headers?: StaticTableColumnHeader[];
  containerClassName?: string;
  dense?: boolean;
  children?: ReactNode;
}

export interface StaticTableHeadProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export interface StaticTableThProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: StaticTableAlign;
  width?: string | number;
  minWidth?: string | number;
  children?: ReactNode;
}

export interface StaticTableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export interface StaticTableRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  clickable?: boolean;
  children?: ReactNode;
}

export interface StaticTableTdProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: StaticTableAlign;
  dense?: boolean;
  children?: ReactNode;
}

export interface StaticTableEmptyProps {
  colSpan: number;
  icon?: ReactNode;
  message?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const getAlignmentClass = (align?: StaticTableAlign): string => {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
};

export const StaticTableHead: FC<StaticTableHeadProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <thead
      className={`bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] font-medium text-xs border-b border-[var(--color-border)] select-none ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
};

export const StaticTableTh: FC<StaticTableThProps> = ({
  align = "left",
  width,
  minWidth,
  className = "",
  style,
  children,
  ...props
}) => {
  const dynamicStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(minWidth !== undefined ? { minWidth } : {}),
  };

  return (
    <th
      className={`py-3 px-3 tracking-normal ${getAlignmentClass(
        align
      )} ${className}`}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </th>
  );
};

export const StaticTableBody: FC<StaticTableBodyProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tbody
      className={`divide-y divide-[var(--color-border)] ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
};

export const StaticTableRow: FC<StaticTableRowProps> = ({
  selected = false,
  clickable = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <tr
      className={`transition-colors ${
        selected
          ? "bg-[var(--color-sage-50)] dark:bg-[var(--color-surface-hover)]"
          : "hover:bg-[var(--color-surface-hover)]"
      } ${clickable ? "cursor-pointer" : ""} ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export const StaticTableTd: FC<StaticTableTdProps> = ({
  align = "left",
  dense = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <td
      className={`${dense ? "py-1.5 px-2.5 text-xs" : "py-2.5 px-3 text-sm"} ${getAlignmentClass(
        align
      )} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};

export const StaticTableEmpty: FC<StaticTableEmptyProps> = ({
  colSpan,
  icon,
  message = "No hay registros disponibles",
  children,
  className = "",
}) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`py-12 text-center text-sm text-[var(--color-text-secondary)] ${className}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {icon && <div className="text-[var(--color-text-muted)]">{icon}</div>}
          {message && <p className="font-medium">{message}</p>}
          {children}
        </div>
      </td>
    </tr>
  );
};

export interface StaticTableComponent extends FC<StaticTableProps> {
  Head: typeof StaticTableHead;
  Thead: typeof StaticTableHead;
  Th: typeof StaticTableTh;
  HeadCell: typeof StaticTableTh;
  Body: typeof StaticTableBody;
  Tbody: typeof StaticTableBody;
  Row: typeof StaticTableRow;
  Tr: typeof StaticTableRow;
  Td: typeof StaticTableTd;
  Cell: typeof StaticTableTd;
  Empty: typeof StaticTableEmpty;
}

export const StaticTable: StaticTableComponent = Object.assign(
  ({
    headers,
    containerClassName = "",
    className = "",
    dense = false,
    children,
    ...props
  }: StaticTableProps) => {
    return (
      <div
        className={`border border-[var(--color-border)] rounded-xl overflow-x-auto bg-[var(--color-surface-card)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#22B2B8] before:via-[#8B5CF6] before:via-[#F43F5E] before:via-[#F97316] before:to-[#F59E0B] before:z-10 ${containerClassName}`}
      >
        <table
          className={`w-full text-left whitespace-nowrap ${
            dense ? "text-xs" : "text-sm"
          } ${className}`}
          {...props}
        >
          {headers && headers.length > 0 && (
            <StaticTableHead>
              <tr>
                {headers.map((h, i) => (
                  <StaticTableTh
                    key={h.key ?? i}
                    align={h.align}
                    width={h.width}
                    minWidth={h.minWidth}
                    className={h.className}
                    style={h.style}
                  >
                    {h.label}
                  </StaticTableTh>
                ))}
              </tr>
            </StaticTableHead>
          )}
          {children}
        </table>
      </div>
    );
  },
  {
    Head: StaticTableHead,
    Thead: StaticTableHead,
    Th: StaticTableTh,
    HeadCell: StaticTableTh,
    Body: StaticTableBody,
    Tbody: StaticTableBody,
    Row: StaticTableRow,
    Tr: StaticTableRow,
    Td: StaticTableTd,
    Cell: StaticTableTd,
    Empty: StaticTableEmpty,
  }
);

export default StaticTable;
