export const ReferralTabContentBurnt = () => {
  return (
    <div className="bg-base-300 overflow-hidden rounded-xl">
      <div className="bg-base-100 flex h-14 items-center justify-between px-5">
        <h4 className="text-base font-bold">Burnt</h4>
        <div className="bg-base-200 flex h-8 items-center gap-2 rounded-lg px-3">
          <div className="text-sm font-semibold">Rules</div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.5999 7.00039C12.5999 10.0932 10.0927 12.6004 6.9999 12.6004C3.90711 12.6004 1.3999 10.0932 1.3999 7.00039C1.3999 3.9076 3.90711 1.40039 6.9999 1.40039C10.0927 1.40039 12.5999 3.9076 12.5999 7.00039ZM6.25744 4.85791C6.05242 5.06294 5.72 5.06294 5.51498 4.85791C5.30995 4.65289 5.30995 4.32047 5.51498 4.11545C6.33508 3.29535 7.66473 3.29535 8.48483 4.11545C9.30493 4.93555 9.30493 6.2652 8.48483 7.0853C8.21009 7.36003 7.8769 7.54333 7.5249 7.63394V7.87537C7.5249 8.16532 7.28985 8.40037 6.9999 8.40037C6.70995 8.40037 6.4749 8.16532 6.4749 7.87537V7.52537C6.4749 7.02116 6.87387 6.70517 7.23184 6.62464C7.41866 6.58262 7.59603 6.48917 7.74237 6.34283C8.15242 5.93278 8.15242 5.26796 7.74237 4.85791C7.33231 4.44786 6.66749 4.44786 6.25744 4.85791ZM6.9999 10.5004C7.3865 10.5004 7.6999 10.187 7.6999 9.80039C7.6999 9.41379 7.3865 9.10039 6.9999 9.10039C6.6133 9.10039 6.2999 9.41379 6.2999 9.80039C6.2999 10.187 6.6133 10.5004 6.9999 10.5004Z"
              fill="#A6ADBB"
              style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 1 }}
            />
          </svg>
        </div>
      </div>
      <Table />
    </div>
  );
};

const transactions = [
  { id: 1, type: 'Deposit', amount: '+ ₱994.33', status: 'Success', date: '2024-03-15' },
  { id: 2, type: 'Withdrawal', amount: '+ ₱500.00', status: 'Pending', date: '2024-03-14' },
  { id: 3, type: 'Deposit', amount: '+ ₱2892.28', status: 'Expired', date: '2024-03-13' },
  { id: 4, type: 'Withdrawal', amount: '+ ₱500.00', status: 'Completed', date: '2024-03-12' },
];

const Table = () => {
  return (
    <table className="table-md border-base-300 table border-t border-b">
      <thead className="bg-base-100 h-10 rounded text-xs">
        <tr>
          <th className="text-base-content/60 text-xs font-bold">Commission Type | Relationship</th>
          <th className="text-base-content/60 text-right text-xs font-bold">Amount | Username</th>
        </tr>
      </thead>
      <tbody className="bg-base-200 text-sm">
        {transactions.map((user, index) => (
          <tr key={index} className="border-base-300 h-16 border-t border-b">
            <td>
              <div className="text-sm font-semibold">{user.type}</div>
              <div className="text-base-content/50 text-sm">{user.date}</div>
            </td>
            <td className=" ">
              <div className="flex items-center justify-end gap-1">
                <div className="text-error text-sm font-semibold">{user.amount}</div>
                <img src="/icons/currency/php.svg" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="text-base-content/50 text-sm font-semibold">{user.status}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.7676 11.8159C5.53792 11.577 5.54537 11.1972 5.78423 10.9675L8.93443 8L5.78423 5.0325C5.54537 4.80282 5.53792 4.423 5.7676 4.18413C5.99727 3.94527 6.3771 3.93782 6.61596 4.1675L10.216 7.5675C10.3336 7.68062 10.4001 7.83679 10.4001 8C10.4001 8.16321 10.3336 8.31938 10.216 8.4325L6.61596 11.8325C6.3771 12.0622 5.99727 12.0547 5.7676 11.8159Z"
                    fill="#A6ADBB"
                    style={{ fill: 'color(display-p3 0.6510 0.6784 0.7333)', fillOpacity: 0.5 }}
                  />
                </svg>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
