import type { DiffTableProps } from "@/types/json-diff.types";


function getValueByPath(obj: any, path: string[]): any {
  return path.reduce((acc, key) => (acc !== undefined ? acc[key] : undefined), obj);
}

export function DiffTable({ diffPaths, jsonA, jsonB }: DiffTableProps) {
  return (
    <div className="mt-4 overflow-auto max-h-[500px]">
      <table className="min-w-full border dark:border-slate-600">
        <thead>
          <tr className="bg-gray-100 dark:bg-slate-700">
            <th className="border p-2 dark:border-slate-600 dark:text-white">
              Path
            </th>
            <th className="border p-2 dark:border-slate-600 dark:text-white">
              Value A
            </th>
            <th className="border p-2 dark:border-slate-600 dark:text-white">
              Value B
            </th>
            <th className="border p-2 dark:border-slate-600 dark:text-white">
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {diffPaths.map((path, i) => {
            const valueA = getValueByPath(jsonA, path);
            const valueB = getValueByPath(jsonB, path);
            const typeA = valueA !== undefined ? typeof valueA : 'undefined';
            const typeB = valueB !== undefined ? typeof valueB : 'undefined';
            const typeChanged = typeA !== typeB;
            
            return (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-600">
                <td className="border p-2 font-mono text-sm dark:border-slate-600 dark:text-white">
                  {path.join(".")}
                </td>
                <td className="border p-2 bg-red-50 font-mono text-sm dark:bg-red-900/30 dark:border-slate-600 dark:text-white">
                  {valueA === undefined ? 'undefined' : typeof valueA === "object" ? JSON.stringify(valueA) : String(valueA)}
                </td>
                <td className="border p-2 bg-green-50 font-mono text-sm dark:bg-green-900/30 dark:border-slate-600 dark:text-white">
                  {valueB === undefined ? 'undefined' : typeof valueB === "object" ? JSON.stringify(valueB) : String(valueB)}
                </td>
                <td className={`border p-2 font-mono text-sm dark:border-slate-600 ${typeChanged ? 'bg-yellow-100 dark:bg-yellow-900/50' : ''}`}>
                  {typeChanged ? `${typeA} → ${typeB}` : typeA}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}