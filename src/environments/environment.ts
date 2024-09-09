export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  servizi:{
    auth:{
      login:'auth/login',
      logout:'auth/logout',
      resetPassword:'auth/resetPassword',
      setPassword:'auth/setPassword',
      editProfile:'auth/editImpiegato/',
      checkJWT: "auth/checkJWT",
      getAllNotification:'auth/notificationList',

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
