export default function DeptCard({ dept }) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold text-lg">{dept.department_name}</h3>
      <p className="text-sm text-gray-600 mb-2">{dept.specialty}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Staff</span>
        <span className="font-semibold">{dept.staff_count || 0}</span>
      </div>
    </div>
  );
}
