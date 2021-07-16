const MOCK = {
  API: {
    BASE: 'http://localhost:4000',
    ROUTE: {
      LOGIN: '/api/auth/login',
      COMMON_MENU_TYPE: '/api/common/menu-types',
    },
  },
  JWT: {
    INVALID: 'adasdasdasdas',
    INCORRECT_DATA:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJ1c2VybmFtZSI6IkVycm9yIiwiaWF0IjoxNjIyMDQ2NDM4LCJleHAiOjE2MjIxMzI4Mzh9.RGV41YYmHcL9KqHc3_lGRn_31GLCK4qsELnk4lt3piw',
    EXPIRED:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImZ1bGxOYW1lIjoiYWRtaW4iLCJlbWFpbCI6bnVsbCwiaXNBY3RpdmUiOnRydWUsImxvZ2luRGF0ZVRpbWUiOm51bGwsImlhdCI6MTYyNjQzNTM0MSwiZXhwIjoxNjI2NDM4OTQxfQ.k7UoiLi8fgYx6HGMCccsC47kQX84uEfrlPI-CA9fepw',
  },
};

export default MOCK;
