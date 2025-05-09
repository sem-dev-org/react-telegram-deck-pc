export const mockReferralFaq = (t: (key: string, values?: Record<string, any>) => string) => [      
  {
    id: 'referralFaqOne',
    text: {
      title: t('referral:faqOne.title'),
      content: t('referral:faqOne.content' ),
      open: false,
//         content: `
//             <p class="leading-7">
// When you share your referral link with your friends and they sign up at our site; they become your referral and will earn you commission and referral rewards by playing at the 1st.game Alliance.
//             </p>
//             `,
    },
  },
  {
    id: 'referralFaqTwo',
    text: {
      title: t('referral:faqTwo.title'),
      content: t('referral:faqTwo.content' ,{
        amount: '$1200',
        percentage: '50%',
      }),
      open: false,
    },
//       content: `
//           <p class="leading-7">
// You can earn {{percentage}} of their wager activity as commissions + {{amount}} per referral.
//           </p> 
//         `,
  },
  {
    id: 'referralFaqThree',
    text: {
      title: t('referral:faqThree.title',{
        amount: '$1200',
      }),
      content: t('referral:faqThree.content', {
        amount: '$1200',
        parts: '16',
        level: 'VIP5 to VIP80',
        gameUrl: 'https://1st.game',
        gameName: '1st.game',
      }),
      open: false,
    },
//       content: `
//           <p class="leading-7">
// There is a {{amount}} USD reward for each referral you bring to <a href={{gameUrl}} class="text-primary font-bold text-sm">{{gameName}}</a>. This USD reward is given in {{parts}} parts as your referral level goes up from {{level}}.    
//       </p> 
//         `,
  },
  {
    id: 'referralFaqFour', 
    text: {
      title: t('referral:faqFour.title'), 
      content: t('referral:faqFour.content', {
        email: 'business@1st.game',
      }),
      open: false,
    },
//       content: `
//           <p class="leading-7">
// If you have a website with good traffic or a social media account with a big audience, you can email us at <a href="mailto:{{email}}" class="text-primary font-bold text-sm">{{email}}</a>
//  </p> 
//         `,
  },
  {
    id: 'referralFaqFive',
    text: {
      title: t('referral:faqFive.title'),
      content: t('referral:faqFive.content',{
        codes: '20',
      }),
      open: false,
//       content: `
//       <p class="leading-7">
// You can create up to {{codes}} unique codes for different sources of traffic
//       </p> 
//     `,
    },
  },
  {
    id: 'referralFaqSix',
    text: {
      title: t('referral:faqSix.title'),
      content: t('referral:faqSix.content',{
        gameUrl: 'https://1st.game',
        gameName: '1st.game',
      }),
      open: false,
//       content: `
//       <p class="leading-7">
// Yes, Transparency, Trust, and Fairness are part of <a href={{gameUrl}} class="text-primary font-bold text-sm">{{gameName}}</a>'s core values. Data like username, total wager and commission earned are all available in the "My Commissions" and "Referral Rewards" tab.    
//  </p> 
//     `,
    },
  },
  {
    id: 'referralFaqSeven', 
    text: {
      title: t('referral:faqSeven.title'),
      content: t('referral:faqSeven.content'),
      open: false,
  //     content: `
  //       <p class="leading-7">
  // Yes, you can share the commission rewards with your referrals by clicking "create new campaign" and setting the commission split under the "Campaigns" tab.
  //       </p> 
  //   `,
    },
  },
  {
    id: 'referralFaqEight', 
    text: {
      title: t('referral:faqEight.title'),
      content: t('referral:faqEight.content'),
      open: false,
  //     content: `
  //       <p class="leading-7">
  // An indirect referral is an active player that comes in from the invite link of one of your direct referrals. If your VIP level is higher than the VIP level of your direct referral, you can also earn commission arising from your indirect referral.    
  //   </p> 
  //   `,
    },
  }
];
