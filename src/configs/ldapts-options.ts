const ldapOptions = {
  url: process.env.LDAP_URI || 'LDAP://10.70.170.41/',
  bindDN: process.env.LDAP_BIND_DN || 'DC=geo,DC=net',
};

export default ldapOptions;
