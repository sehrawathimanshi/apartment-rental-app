export const VARIABLES = {
    USER: '/api/user',

};

export const ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    APARTMENT_LIST: '/apartments',
    POST_APARTMENT: '/post-apartment'
};

export const LOCAL_STORAGE = {
    LOGIN_USER_EMAIL: 'loggedInUserEmail',
    SAVED_APARTMENTS: 'apartments',
    IS_LOGGED_IN: 'isLoggedIn',
    ROLE: 'role'
}

export const ALERTS = {
    ALL_FIELDS: 'Please fill out all fields!',
    SELECT_ROLES: 'Please select a role: User or Landlord.',
    EMAIL_ALREADY_EXIST: 'Email is already registered.',
    INVALID: 'Invalid email, password, or role!'

}

export const SUCCESS_MESSAGES = {
    REGISTERATION_COMPLETED: 'Registration successful! Please log in.'
}

export const ROLES = {
    USER: 'user',
    LANDLORD: 'landlord'
}
