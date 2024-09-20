import { TableProps } from "../interfaces/components"

export const Table = ({titles, body}: TableProps) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {titles.map((title, key) => (
              <th key={key} scope="col" className="px-6 py-3">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              {titles.map((title, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {row[title]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
