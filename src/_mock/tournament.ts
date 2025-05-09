export const mockTournament = (t: (key: string) => string) => [
  {
    id: 'jili',
    text: {
      title: t('tournament:jiliTitle'), // 'JILI Slots Mega Bonanza',  
      description: t('tournament:jiliDescription'), // 'Rules & Terms',
      content: t('tournament:jiliContent'),
      //  `
      //   <div class="text-sm">
      //       <p class="leading-5">
      //         Get ready for the JILI Slots Mega Bonanza Weekly Tournament, where the top 30 players per league win massive
      //         rewards every week!
      //       </p>
  
      //       <p class="mt-5 leading-5">
      //         The tournament runs from Sunday (00:00 GMT) to the following Sunday (23:59 GMT), giving you seven days to
      //         climb the leaderboard and secure your spot among the winners.
      //       </p>
  
      //       <h4 class="mt-5 leading-5">How It Works</h4>
      //       <ol class="list-decimal pl-4 leading-5">
      //         <li>
      //           <span class="font-medium"></span>Play JILI Slots – Only bets placed on JILI slots during the
      //           tournament period count.
      //         </li>
      //         <li>
      //           <span class="font-medium"></span>Compete in Your VIP League – Players are automatically placed in
      //           their VIP level's league at the start of each race. If a player ranks up during the tournament, they will
      //           be upgraded to the next league in the following round.
      //         </li>
      //         <li>
      //           <span class="font-medium"></span>Leaderboard Ranking – Players are ranked by their total bet amount
      //           (not wins or losses).
      //         </li>
      //         <li>
      //           <span class="font-medium"></span>Tournament Duration – Runs every week from Sunday (00:00 GMT) to the
      //           following Sunday (23:59 GMT).
      //         </li>
      //         <li>
      //           <span class="font-medium"></span>Top 30 Winners Per League – The top 30 players in each league will
      //           receive cash rewards, free spins, or bonus credits.
      //         </li>
      //         <li>
      //           <span class="font-medium"></span>Real-Time Leaderboard – Track your ranking throughout the week with
      //           live updates.
      //         </li>
      //         <li>
      //           <span class="font-medium"></span>Prizes & Payouts – Rewards are automatically credited after the
      //           tournament ends.
      //         </li>
      //         <li>
      //           <span class="font-medium"></span>Fair Play Policy – Any fraudulent activity or abuse will result in
      //           disqualification.
      //         </li>
      //         <li>
      //           <span class="font-medium"></span>General Terms – The casino reserves the right to modify or cancel
      //           this promotion at any time.
      //         </li>
      //       </ol>
  
      //       <p class="mt-5 leading-5">
      //         Spin big, rank up, and win daily! The higher your VIP level, the bigger the rewards!
      //       </p>
      //   </div>
      //   `,
    },
  },
  {
    id: 'pg',
    text: {
      title: t('tournament:pgTitle'), // 'PG Soft Races',
      description: t('tournament:pgDescription'), // 'Rules & Terms',
      content: t('tournament:pgContent'),
      //`
        // <div class="text-sm">
        //     <p class="leading-5">
        //       Step into the PG Slots Daily Race and compete against players in your VIP tier for massive rewards! With four leagues - Bronze, Silver, Gold, and Platinum -based on VIP levels, everyone gets a fair chance to win.
        //     </p>
  
        //     <p class="mt-5 leading-5">
        //       The race resets every day at 00:00 GMT, so there's always a fresh opportunity to claim top prizes.
        //     </p>
  
        //     <h4 class="mt-5 leading-5">How It Works</h4>
        //     <ol class="list-decimal pl-4 leading-5">
        //       <li>
        //         <span class="font-medium"></span>Play PG Slots – Only bets placed on PG Soft Slots count toward the race.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Compete in Your VIP League – Players are automatically placed in
        //         their VIP level's league at the start of each race. If a player levels up during the tournament, they will
        //         be upgraded to the next league in the following round.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Climb the Leaderboard – Leaderboard rankings are determined by total bet amounts, not wins or losses. The more you bet, the higher you rank.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Daily Reset – The race starts fresh every day at 00:00 GMT and runs for 24 hours to 23:59 GMT.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Win Daily Rewards – The top 5 players in each league receive cash prizes, free spins, or bonus credits. Rewards are automatically credited after the race ends.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Real-Time Leaderboard – Stay updated with your rank as the leaderboard refreshes in real time.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Fair Play Policy – Any fraudulent activity or abuse will result in disqualification.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>General Terms – The casino reserves the right to modify or cancel this promotion at any time.
        //       </li>
        //     </ol>
  
        //     <p class="mt-5 leading-5">
        //       Spin big, rank up, and win daily! The higher your VIP level, the bigger the rewards!
        //     </p>
        //   </div>`,
    },
  },
  {
    id: 'lucky-number-seven',
    text: {
      title: t('tournament:luckyNumberSeven'), // 'Lucky Number Seven',
      description: t('tournament:luckyNumberSevenDescription'), // 'Rules & Terms',
      content: t('tournament:luckyNumberSevenContent'),
      // `
      //   <div class="text-sm">
        //     <p class="leading-5">Hit the lucky sevens and claim your instant bonus! If your Bet ID ends in 7777 while playing PG Soft or JILI slots, you’ll receive your bet amount back as a bonus - up to <span class="font-bold">₱2,868.20</span>.             </p>
  
        //     <p class="mt-5 leading-5">No wagering requirements, no strings attached - just free cash! Simply visit your Bonus page and click Claim to receive your reward.            </p>
  
        //     <h4 class="mt-5 leading-5">Rules & Terms:</h4>
        //     <ol class="list-decimal pl-4 leading-5">
        //       <li>
        //         <span class="font-medium"></span>Eligibility: Only bets placed on PG and JILI slots qualify for this promotion.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Winning Condition: If your Bet ID ends in 7777, you’ll receive 100% of your bet amount as a bonus (up to $50).
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Claim Frequency: Users can claim this bonus once per day if they meet the criteria.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Maximum Bonus: The bonus amount is capped at $50 USD per qualifying Bet ID.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>How to Claim:
        //         <ol class="pl-2 leading-5">
        //           <li>
        //             <span class="">• </span>Visit the Bonus Page after meeting the condition.
        //           </li>
        //           <li>
        //             <span class="">• </span>Click the Claim button to receive your bonus.
        //           </li>
        //         </ol>
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>No Wagering Requirement: Funds are instantly available for withdrawal or further gameplay.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>Automatic Qualification: The system tracks eligible Bet IDs and makes the bonus available for claiming.
        //       </li>
        //       <li>
        //         <span class="font-medium"></span>General Terms: The casino reserves the right to modify or terminate this promotion at any time. Abuse or fraudulent activity will result in disqualification from the promotion.
        //       </li>
        //     </ol>
        // </div>`,
    },
  },
  {
    id: '0',
    text: {
      title: t('tournament:beginnerTitle'), // "Beginner's Luck",
      description: t('tournament:beginnerDescription'), // 'Rules & Terms',
      content: t('tournament:beginnerContent'),
      // `
        // <div class="text-sm">
        //     <p class="leading-5">New to the casino? Beginner's Luck is here to give you a daily shot at big rewards! This VIP 1-exclusive tournament is designed just for new players, letting you compete for cash prizes, free spins, and bonus credits by simply playing slot games.</p>
        //     <p class="mt-5 leading-5">All VIP 1 players' wagers automatically count toward the tournament, meaning no extra steps—just spin and play as usual! If you level up during the tournament, you'll stay in until 23:59 GMT, but you won't be eligible to enter again the next day.</p>
        //     <p class="mt-5 leading-5 font-medium">How It Works:</p>
        //     <ol class="list-decimal pl-4 leading-5">
        //         <li>
        //             <span class="font-medium">Play Slot Games:</span> Only bets placed on slot games count toward the tournament.
        //         </li>
        //         <li>
        //             <span class="font-medium">Automatic Participation:</span> All VIP 1 players' wagers automatically count toward the tournament.
        //         </li>
        //         <li>
        //             <span class="font-medium">One-Time Entry Per Player:</span> If you level up during the tournament, you remain a participant for that day, but you won't be eligible to re-enter the next day.
        //         </li>
        //         <li>
        //             <span class="font-medium">Leaderboard Ranking:</span> Players are ranked based on total bet amounts (not wins or losses).
        //         </li>
        //         <li>
        //             <span class="font-medium">Tournament Duration:</span> Runs daily from 00:00 GMT to 23:59 GMT.
        //         </li>
        //         <li>
        //             <span class="font-medium">Top 30 Players Win:</span> The top 30 players will receive cash prizes, free spins, or bonus credits.
        //         </li>
        //         <li>
        //             <span class="font-medium">Live Leaderboard:</span> Track your ranking and push for the top with real-time updates.
        //         </li>
        //         <li>
        //             <span class="font-medium">Instant Payouts:</span> Prizes are automatically credited after the tournament ends.
        //         </li>
        //         <li>
        //             <span class="font-medium">Fair Play Policy:</span> Any fraudulent activity or abuse will result in disqualification.
        //         </li>
        //         <li>
        //             <span class="font-medium">General Terms:</span> The casino reserves the right to modify or cancel this promotion at any time.
        //         </li>
        //     </ol>
        //     <p class="mt-5 leading-5">Just spin, bet, and let beginner's luck do the rest!</p>
        //  </div>`,
    },
  },
];
