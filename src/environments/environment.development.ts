// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  wsUrl: 'ws://localhost:8080/ws',
  servizi:{
    auth:{
      login:'auth/login',
      logout:'auth/logout',
      resetPassword:'auth/resetPassword',
      setPassword:'auth/setPassword',
      editProfile:'auth/editImpiegato/',
      fetchChipsForDashboard: "auth/fetchChipsForDashboard",
      checkJWT: "auth/checkJWT",
      getAllNotification:'auth/notificationList',
    },
    file:{
      downloadGiustificativi:'file/downloadGiustificativo',
      downloadAllegati:'file/downloadAllegato',
      deleteBustaPaga:'file/deleteBustaPaga',
      downloadBustePaga:'file/downloadBustaPaga',
      submitGiustificativoFiles:'file/insertGiustificativo',
      submitAllegatoFile:'file/insertAllegato',
      submitBustaPagaFile:'file/insertBustaPaga',
      getAllegatiAndGiustificativi:'file/getGiustificativiAndAllegati',
      getBustePagaAdmin:'file/getBustePaga',
      getBustePaga:'file/getBustePaga',
    },
    impiegato:{
      getAllTimesheetOption:'operator/getTimesheetOptionList',
      getAllTimesheetLogged:'operator/getTimesheetElenco',
      submitPeriodTimesheet:'operator/insertNewTimesheetP',
      submitOptionTimesheet:'operator/getTimesheet/',
      submitDatoTimesheet:'operator/InsertDatoTimesheet',
      submitTimesheet:'operator/sendTimesheet',
      submitTimesheetNoSave:'operator/sendTimesheet/',
      updateNgiustificativo:'operator/updateNumeroGiustificativo/',
      fetchBarChart:'operator/fetchBarChart',
      fetchPieChart:'operator/fetchPieChart',
    },
    admin:{
      getAllImpiegato:'admin/allImpiegato',
      getTImesheetById:'admin/getTimesheet/',
      approvaTimesheet:'admin/updateStatusApproved/',
      rifiutaTimesheet:'admin/updateStatusRejected/',
      getAllTimesheetOption:'admin/getAdminOptionList/imp',
      getAllImpiegatoFR:'admin/allImpiegatoFR',
      editImpiegato:'admin/editImpiegato',
      getResiduoGenerale:'admin/getResiduoGenerale',
      getResiduoPrec:'admin/getResiduoPrec',
      getResiduoAtt:'admin/getResiduoAtt',
      insertImpiegato:'admin/insertImpiegato',
      setFR:'admin/setFR/',
      deleteImp:'admin/deleteImpiegato',
      getAllRole:'admin/getAllRoles',
      submitSearchTImesheet:'admin/getTimesheetResultList'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
