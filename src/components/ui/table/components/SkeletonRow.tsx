export const SkeletonRow = ({ columns }: { columns: any[] }) => (
  <tr className="bg-gray-600 animate-pulse">
    {columns.map((_, index) => (
      <td key={index} className="p-0">
        <div className="bg-gray-400 h-[32px] w-full"></div>
      </td>
    ))}
  </tr>
);
