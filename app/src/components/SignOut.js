import React from 'react';

import { auth } from '../firebase';

const SignOut = () => 
    <button
        type="button"
        onClick={auth.signOut}
    >
    Sign Out
    </button>

export default SignOut;