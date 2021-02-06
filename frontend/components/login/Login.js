import React, { useState, useEffect } from 'react';

import Signin from './Signin';
import Signup from './Signup';

const Login = () => {
  const [isToggled, setToggle] = useState(false);

  function handleSwitch(isToggled) {
    setToggle(isToggled);
  }

  function handleKeySwitch(event) {
    if (event.keyCode === 39 || event.keyCode === 37) {
      setToggle(!isToggled);
    }
  }

  return (
    <div>
      <div role='tablist' aria-label='login'>
        <button
          role='tab'
          id='signin'
          aria-controls='signin-tab'
          tabIndex={isToggled ? '0' : '-1'}
          aria-selected={!isToggled}
          onKeyDown={handleKeySwitch}
          onClick={() => handleSwitch(false)}
        >
          sign up
        </button>
        <button
          role='tab'
          id='signup'
          aria-controls='signup-tab'
          aria-selected={isToggled}
          tabIndex={isToggled ? '-1' : '0'}
          onKeyDown={handleKeySwitch}
          onClick={() => handleSwitch(true)}
        >
          sign in
        </button>
      </div>
      <div
        hidden={isToggled ? '' : 'hidden'}
        role='tabpanel'
        id='signin-tab'
        tabIndex='0'
        aria-labelledby='signin'
      >
        { isToggled && <Signin /> }
      </div>

      <div
        hidden={isToggled ? 'hidden' : ''}
        role='tabpanel'
        id='signup-tab'
        tabIndex='0'
        aria-labelledby='signup'
      >
        {!isToggled && <Signup /> }
      </div>
    </div>
  );
}

export default Login;
