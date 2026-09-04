// Shared table pieces so every record view looks identical.

export function Table({ head, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((col) => (
              <th
                key={col.label}
                scope="col"
                className={`border-b border-line-strong px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap text-muted ${
                  col.num ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "", num = false }) {
  return (
    <td
      className={`border-b border-line px-3.5 py-2 align-middle ${
        num ? "text-right font-mono" : ""
      } ${className}`}
    >
      {children}
    </td>
  );
}

export function IdCell({ id }) {
  return <Td className="w-11 font-mono text-[12.5px] text-muted">{id}</Td>;
}

export function Row({ children }) {
  return <tr className="hover:bg-surface-2/60 last:[&>td]:border-b-0">{children}</tr>;
}
