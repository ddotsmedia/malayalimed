export default function CredentialBadge({ cred }) {
  return (
    <div className="border rounded p-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{cred.credential_name}</p>
          <p className="text-sm text-gray-600">{cred.credential_number}</p>
          <p className="text-xs text-gray-500">{cred.issuing_body}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${cred.verification_status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {cred.verification_status}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {cred.issue_date} - {cred.expiry_date}
      </p>
    </div>
  );
}
