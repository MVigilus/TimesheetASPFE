export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  wsUrl: 'ws://localhost:8080/ws',
  servizi:{
    auth:{
      login:'auth/login',
      logout:'auth/logout',
      resetPassword:'auth/resetPassword',
      setPassword:'auth/setPassword',
      editProfile:'auth/editImpiegato/',
      checkJWT: "auth/checkJWT",
      fetchChipsForDashboard: "auth/fetchChipsForDashboard",
      getAllNotification:'auth/notificationList',

    },
    file:{
      downloadGiustificativi:'file/downloadGiustificativo',
      downloadAllegati:'file/downloadAllegato',
      downloadBustePaga:'file/downloadBustaPaga',
      submitGiustificativoFiles:'operator/insertGiustificativo',
      submitAllegatoFile:'operator/insertAllegato',
      submitBustaPagaFile:'admin/insertBustaPaga',
    },
    impiegato:{
      getAllTimesheetOption:'operator/getTimesheetOptionList',
      getAllTimesheetLogged:'operator/getTimesheetElenco',
      updateNgiustificativo:'operator/updateNumeroGiustificativo/',
      submitPeriodTimesheet:'operator/insertNewTimesheetP',
      submitOptionTimesheet:'operator/getTimesheet/',
      submitDatoTimesheet:'operator/InsertDatoTimesheet',
      submitTimesheet:'operator/sendTimesheet',
      submitTimesheetNoSave:'operator/sendTimesheet/',
    },
    admin:{
      getAllImpiegato:'admin/allImpiegato',
      approvaTimesheet:'admin/updateStatusApproved/',
      rifiutaTimesheet:'admin/updateStatusRejected/',
      getTImesheetById:'admin/getTimesheet/',
      getResiduoGenerale:'admin/getResiduoGenerale',
      getResiduoPrec:'admin/getResiduoPrec',
      getResiduoAtt:'admin/getResiduoAtt',
      getAllTimesheetOption:'admin/getAdminOptionList/imp',
      getAllImpiegatoFR:'admin/allImpiegatoFR',
      editImpiegato:'admin/editImpiegato',
      setFR:'admin/setFR',
      deleteImp:'admin/deleteImpiegato',
      insertImpiegato:'admin/insertImpiegato',
      getAllRole:'admin/getAllRoles',
      submitSearchTImesheet:'admin/getTimesheetResultList'
    }
  }
};
