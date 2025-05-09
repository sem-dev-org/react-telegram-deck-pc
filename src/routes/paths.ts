
const ROOTS = {
  DASHBOARD: '/main',
};

export const paths = {
  main: {
    casino: {
      root: `${ROOTS.DASHBOARD}/casino`,
    },

    finance: {
      root: `${ROOTS.DASHBOARD}/finance`,
      deposit: `${ROOTS.DASHBOARD}/finance/deposit`,
      withdraw: `${ROOTS.DASHBOARD}/finance/withdraw`,
    },

    bonus: {
      root: `${ROOTS.DASHBOARD}/bonus`,
    },

    profile: {
      root: `${ROOTS.DASHBOARD}/profile`,
      edit: `${ROOTS.DASHBOARD}/profile/edit`,
      avatar: `${ROOTS.DASHBOARD}/profile/avatar`,

      security: {
        root: `${ROOTS.DASHBOARD}/profile/security`,
        setWithdrawalPin: `${ROOTS.DASHBOARD}/profile/security/set-withdrawal-pin`,
        updateWithdrawalPin: `${ROOTS.DASHBOARD}/profile/security/update-withdrawal-pin`,
        enterWithdrawalPin: `${ROOTS.DASHBOARD}/profile/security/enter-withdrawal-pin`,
      },

      verification: {
        root: `${ROOTS.DASHBOARD}/profile/verification`,
        basicVerification: `${ROOTS.DASHBOARD}/profile/verification/basic-verification`,
        addressVerification: `${ROOTS.DASHBOARD}/profile/verification/address-verification`,
        idVerification: `${ROOTS.DASHBOARD}/profile/verification/id-verification`,
        changePassword: `${ROOTS.DASHBOARD}/profile/verification/change-password`,
        emailVerification: `${ROOTS.DASHBOARD}/profile/verification/email-verification`,
        phoneVerification: `${ROOTS.DASHBOARD}/profile/verification/phone-verification`,
      },
    },

    explore: {
      root: `${ROOTS.DASHBOARD}/explore`,
    },

    game: {
      root: `${ROOTS.DASHBOARD}/game`,
      details: `${ROOTS.DASHBOARD}/game/details/`,
      iframe: `${ROOTS.DASHBOARD}/game/iframe/`,
    },

    referral: {
      root: `${ROOTS.DASHBOARD}/referral`,
      list: `${ROOTS.DASHBOARD}/referral/list`,
      details: `${ROOTS.DASHBOARD}/referral/details/`,
      commissionsDetails: `${ROOTS.DASHBOARD}/referral/commissions-details/`,
      rewardsDetails: `${ROOTS.DASHBOARD}/referral/rewards-details/`,
    },
    vip: {
      root: `${ROOTS.DASHBOARD}/vip`,
    },

    transaction: {
      root: `${ROOTS.DASHBOARD}/transaction`,
      type: `${ROOTS.DASHBOARD}/transaction/`,
      details: `${ROOTS.DASHBOARD}/transaction/details/`,
    },

    tournament: {
      root: `${ROOTS.DASHBOARD}/tournament`,
    },

    chat: {
      root: `${ROOTS.DASHBOARD}/chat`,
    },
  },
  legal:{
    aboutUs:'/legal/about-us',
    faq: '/legal/faq',
    termOfService: '/legal/term-of-service',
    responsibleGaming: '/legal/responsible-gaming',
    fairness: '/legal/fairness',
  },
  information: {
    loading: '/information/loading',
    pageNotFound: '/information/page-not-found',
    noInternetConnection: '/information/no-internet-connection',
    failedToLoadPage: '/information/failed-to-load-page',
    underMaintenance: '/information/under-maintenance',
    tooManyRequest: '/information/too-many-request',
    userRestriction: '/information/user-restriction',
    emptyStateNoContent: '/information/empty-state-no-content',
    otherActiveSession: '/information/other-active-session',
  },
  login: '/login',

};
