export const vipFaq = (t: (key: string, values?: Record<string, any>) => string) => [
  {
    id: 'vipFaqOne',
    text: {
      title: t('vipFaq:faqOne.title'),
      content: t('vipFaq:faqOne.content'),
      open: false,
//       content: `
//         <p class="leading-7">
// Level up bonus is our way of showing appreciation for loyal players who have been with us since the start. As players move up the VIP levels, they unlock higher level up rewards.
//         </p>
//         `,
    },
  },
  {
    id: 'vipFaqTwo',
    text: {
      title: t('vipFaq:faqTwo.title'),
      content: t('vipFaq:faqTwo.content'),
      open: false,
    },
//     content: `
//       <p class="leading-7">
// Daily Cashback will be awarded to players who suffered losses against their deposit amount. This bonus is issued daily as a percentage of the player's loss amount. Daily cashback percentage will increase with your VIP levels, up to a maximum of 40% cashback, the highest cashback anywhere. Please note that this bonus is only for players who are in a net loss position.
//       </p>
//     `,
  },
  {
    id: 'vipFaqThree',
    text: {
      title: t('vipFaq:faqThree.title'),
      content: t('vipFaq:faqThree.content'),
      open: false,
    },
    // content: `
    //   <p class="leading-7">
    //     Conquests are daily quests randomly given to players for them to earn extra rewards when playing on our website. Conquest Rewards must be claimed within 24 hours before the next cycle and would expire if unclaimed. Conquest rewards are paid in USDT and can be converted to your cryptocurrency of choice via our swap function. 
    //   </p>
    //     `,
  },
  {
    id: 'vipFaqFour',
    text: {
      title: t('vipFaq:faqFour.title'),
      content: t('vipFaq:faqFour.content'),
      open: false,
    },
    // content: `
    //   <p class="leading-7">
    //     Tournament Rewards are prizes given for outstanding performance in competitions. Tournament Rewards will accumulate until claimed and have no expiry date. Tournament rewards are paid in USDT and can be converted to your cryptocurrency of choice via our swap function.
    //   </p>
    //   `,
  },
  {
    id: 'vipFaqFive',
    text: {
      title: t('vipFaq:faqFive.title'),
      content: t('vipFaq:faqFive.content'),
      open: false,
    //   content: `
    //         <p class="leading-7">
    //         Super Rakeback is our mechanism for unlocking your deposit bonuses. A percentage of your wager (up to 3%) gets returned to you every time you place a bet. The higher your VIP level, the higher the unlock rate. 
    //         Unlocked USDT= Wager x 2.5% x Unlock rate%
    //         </p>
    //         <p class="leading-7">
    //         Unlock Rate: 
    //         </p>
    //         <p class="leading-7">
    //         VIP 0-40: 20%
    //         </p>
    //         <p class="leading-7">
    //         VIP 41-60: 32%
    //         </p>
    //         <p class="leading-7">
    //         VIP 61-80: 40%
    //         </p>
    //         <p class="leading-7">
    //         VIP 81-100: 52%
    //         </p>
    //         <p class="leading-7">
    //         VIP 101-125: 60%
    //         </p>
    //        `,
    },
  },
  {
    id: 'vipFaqSix',
    text: {
      title: t('vipFaq:faqSix.title'),
      content: t('vipFaq:faqSix.content'),
      open: false,
      // content: `
      //       <p class="leading-7">
      //       Boosters double your Rakeback for one hour every time a referral makes a deposit. 
      //       </p>
      //       <p class="leading-7">
      //       Boosted Unlock Rate:
      //       </p>
      //       <p class="leading-7">
      //       Unlock Rate: 
      //       </p>
      //       <p class="leading-7">
      //       VIP 0-40: 40%
      //       </p>
      //       <p class="leading-7">
      //       VIP 41-60: 72%
      //       </p>
      //       <p class="leading-7">
      //       VIP 61-80: 80%
      //       </p>
      //       <p class="leading-7">
      //       VIP 81-100: 102%
      //       </p>
      //       <p class="leading-7">
      //       VIP 101-125: 120%       
      //       </p>
      //     `,
    },
  },
  {
    id: 'vipFaqSeven',
    text: {
      title: t('vipFaq:faqSeven.title'),
      content: t('vipFaq:faqSeven.content'),
      open: false,
      // content: `
      //       <p class="leading-7">
      //         Most bonuses are paid 50% to your Real Balance and 50% to your Bonus Calendar. Bonuses paid to your Bonus Calendar can be claimed every 8 hours and expire in 24 hours if unclaimed. Remember to claim the bonuses in your Bonus Calendar at least once a day to ensure all your rewards are collected!
      //       </p>
      //   `,
    },
  },
  {
    id: 'vipFaqEight',
    text: {
      title: t('vipFaq:faqEight.title'),
      content: t('vipFaq:faqEight.content',{
         minWager: '$1000',
      }),
      open: false,
      // content: `
      //   <p class="leading-7">
      //   Weekly Bonus is an exclusive perk on our website designed for players who are VIP12 and up. This bonus is issued weekly and automatically paid out every Friday to players at VIP12 and above. The size of the bonus depends on the amount wagered over the past week, with a minimum wager requirement of {{minWager}} over the past week.
      //    </p>
      // `,
    },
  },
  {
    id: 'vipFaqNine',
    text: {
      title: t('vipFaq:faqNine.title'),
      content: t('vipFaq:faqNine.content'),
      open: false,
//       content: `
//       <p class="leading-7">
// Achievements are our way of recognizing your activity on our platform. When you claim your achievement bonus, it will be paid to your Bonus Calender and can be claimed every 8 hours and expire in 24 hours if unclaimed.
//        </p>
//     `,
    },
  },
];
