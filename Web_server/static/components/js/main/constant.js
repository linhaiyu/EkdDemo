myapp.constant('gui_config', {
    WEB_SOCKET_ADDR: "ws://192.168.243.130:8888/chat",
    LOCAL_USER_ITEM: "ekd_gui_user",
    FO_PHYLOGCH_NUMBER : 32,
    FI_PHYLOGCH_NUMBER : 32,
    FTJL_PHYLOGCH_NUMBER: 32

});


myapp.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});


myapp.constant('USER_ROLES', {
  all: '*',
  administrator: 'administrator',
  engineer: 'engineer',
  application_user: 'application user'
});
