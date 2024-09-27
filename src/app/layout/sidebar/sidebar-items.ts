import { RouteInfo } from './sidebar.metadata';
export const ROUTES: RouteInfo[] = [
  {
    path: 'admin/home',
    title: 'MENUITEMS.DASHBOARD.TEXT',
    iconType: 'feather',
    icon: 'home',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
    role:["ROLE_ADMIN"]
  },
  {
    path: 'impiegato/home',
    title: 'MENUITEMS.DASHBOARD.TEXT',
    iconType: 'feather',
    icon: 'home',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
    role:["ROLE_USER"]
  },

  {
    path: 'admin/gestioneImpiegato',
    title: 'MENUITEMS.ADMIN.GESTIONE',
    iconType: 'feather',
    icon: 'users',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
    role:["ROLE_ADMIN"]
  },

  {
    path: 'admin/gestionetimesheet',
    title: 'MENUITEMS.ADMIN.GESTIONET',
    iconType: 'feather',
    icon: 'calendar',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [],
    role:["ROLE_ADMIN"]
  },

  {
    path: '',
    title: 'MENUITEMS.USER.TIMESHEET_MENU.TITLE',
    iconType: 'feather',
    icon: 'calendar',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [
      {
        path: 'impiegato/timesheet',
        title: 'MENUITEMS.USER.TIMESHEET_MENU.OPT1',
        iconType: 'feather',
        icon: 'calendar',
        class: '',
        groupTitle: false,
        badge: 'New',
        badgeClass: 'badge bg-blue sidebar-badge float-end',
        submenu: [],
        role:["ROLE_USER"]
      },
      {
        path: 'impiegato/riepilogoTimesheet',
        title: 'MENUITEMS.USER.TIMESHEET_MENU.OPT2',
        iconType: 'feather',
        icon: 'calendar',
        class: '',
        groupTitle: false,
        badge: 'New',
        badgeClass: 'badge bg-blue sidebar-badge float-end',
        submenu: [],
        role:["ROLE_USER"]
      },
    ],
    role:["ROLE_USER"]
  },

  {
    path: 'riepilogoBustePaga',
    title: 'MENUITEMS.FILEBAG.TITLE',
    iconType: 'feather',
    icon: 'file',
    class: 'menu-toggle',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    submenu: [
      {
        path: 'impiegato/riepilogoBustePaga',
        title: 'MENUITEMS.FILEBAG.OPTIONS.OP1',
        iconType: 'feather',
        icon: 'calendar',
        class: '',
        groupTitle: false,
        badge: 'New',
        badgeClass: 'badge bg-blue sidebar-badge float-end',
        submenu: [],
        role:["ROLE_USER"]
      },
      {
        path: 'admin/riepilogoFile',
        title: 'MENUITEMS.FILEBAG.OPTIONS.OP1',
        iconType: 'feather',
        icon: '',
        class: '',
        groupTitle: false,
        badge: 'New',
        badgeClass: 'badge bg-blue sidebar-badge float-end',
        submenu: [],
        role:["ROLE_ADMIN"]
      },
      {
        path: 'impiegato/riepilogoFile',
        title: 'MENUITEMS.FILEBAG.OPTIONS.OP2',
        iconType: 'feather',
        icon: '',
        class: '',
        groupTitle: false,
        badge: 'New',
        badgeClass: 'badge bg-blue sidebar-badge float-end',
        submenu: [],
        role:["ROLE_USER"]
      },
      {
        path: 'admin/riepilogoBustePaga',
        title: 'MENUITEMS.FILEBAG.OPTIONS.OP2',
        iconType: 'feather',
        icon: '',
        class: '',
        groupTitle: false,
        badge: 'New',
        badgeClass: 'badge bg-blue sidebar-badge float-end',
        submenu: [],
        role:["ROLE_ADMIN"]
      },
    ],
    role:["ROLE_ADMIN"]
  },

 /* {
    path: '',
    title: 'MENUITEMS.EMAIL.TEXT',
    iconType: 'feather',
    icon: 'mail',
    class: 'menu-toggle',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role:["ROLE_USER","ROLE_ADMIN"],
    submenu: [
      {
        path: '/email/inbox',
        title: 'MENUITEMS.EMAIL.LIST.INBOX',
        iconType: '',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        badge: '',
        badgeClass: '',
        submenu: [],
        role:["ROLE_USER","ROLE_ADMIN"],
      },
      {
        path: '/email/compose',
        title: 'MENUITEMS.EMAIL.LIST.COMPOSE',
        iconType: '',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        badge: '',
        badgeClass: '',
        role:["ROLE_USER","ROLE_ADMIN"],
        submenu: [],
      },
      {
        path: '/email/read-mail',
        title: 'MENUITEMS.EMAIL.LIST.READ',
        iconType: '',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        badge: '',
        badgeClass: '',
        role:["ROLE_ADMIN"],
        submenu: [],
      },
    ],
  },*/
];
