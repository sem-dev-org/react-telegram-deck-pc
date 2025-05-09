import { ModalDialog } from '@/components/ui/ModalDialog';

export const PopupAchievements = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <ModalDialog open={open} onClose={onClose} className="h-[70%] bg-transparent p-0">
      <div>
        <div
          className="relative flex h-50 w-full overflow-hidden rounded-t-2xl p-4"
          style={{
            background: `
              radial-gradient(100% 308% at 100% 0%, rgba(247, 127, 92, 0.5) 0%, rgba(20, 25, 31, 0.5) 100%), #14191F`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '170px',
              height: '170px',
              right: '10px',
              bottom: '15px',
            }}
          >
            <img
              src="/images/bouns/missions-info2.png"
              className="absolute h-[170px] w-[170px] object-cover drop-shadow-[0px_-2px_10px_rgba(44,37,47,0.5)]"
            />
          </div>
          <div className="flex flex-col justify-center pl-4">
            <div>
              <p className="font-montserrat text-xl font-bold text-white">LIFETIME</p>
              <p className="text-primary font-montserrat text-xl font-bold whitespace-pre-line">{`ACHIEVEMENTS \n AWARDS`}</p>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col gap-3 p-6"
          style={{
            background: 'linear-gradient(180deg, rgba(69, 129, 155, 0.2) 0%, rgba(27, 35, 43, 0.2) 59.96%), #1B232B',
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base leading-6 font-bold">Achievements</h4>
              <button className="btn btn-secondary h-6 px-2 text-xs font-semibold">General</button>
            </div>
            <p className="text-sm leading-5">
              Achievement Awards are rewards given for reaching new milestones and conquering challenges. They celebrate
              your progress and success, unlocking fun surprises as you achieve new feats along the way!
            </p>
          </div>

          <div className="flex h-3 flex-col justify-center">
            <div className="bg-base-content/10 h-[2px] w-full"></div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-base leading-6 font-bold">Claim Distribution</h4>
            <p className="text-sm leading-5">
              No need to claim or click - your rewards are instantly added to your bonus calendar for 3 days whenever
              you attain a new achievement.
            </p>
          </div>

          <div className="flex h-3 flex-col justify-center">
            <div className="bg-base-content/10 h-[2px] w-full"></div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-base leading-6 font-bold">Expiration</h4>
            <p className="text-sm leading-5">None - Rewards are automatically sent to calendar.</p>
          </div>

          <div className="flex h-3 flex-col justify-center">
            <div className="bg-base-content/10 h-[2px] w-full"></div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-base leading-6 font-bold">General Terms</h4>
            <p className="text-sm leading-5">
              Rewards are calculated and credited in USDT, then displayed in your preferred fiat currency for
              convenience. Please note, currency conversions are approximate.
              <br />
              <br />
              The casino reserves the right to modify or revoke eligibility at any time, without the obligation to
              justify. Any abuse or fraudulent activity will lead to disqualification from the promotion.
            </p>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};
