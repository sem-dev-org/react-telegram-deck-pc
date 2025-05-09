export function MakeTransfer() {
  return (
    <>
      <div className="bg-staking-card-2 rounded-lg h-26 p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img src="/images/make-transfer.png" className="w-15 h-15" />
          <div className="flex flex-col gap-2">
            <div className="text-base font-bold">Make Transfer</div>
            <div className="text-sm">Start Staking to earn up to 20% APY today!</div>
          </div>
        </div>
        <div className="h-8 text-sm font-semibold bg-secondary rounded-lg flex items-center justify-center px-3 text-primary">
          <span>GO</span>
        </div>
      </div>
    </>
  );
}
