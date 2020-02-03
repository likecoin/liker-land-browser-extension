import React from 'react';
import { browser } from 'webextension-polyfill-ts';
import { LIKER_LAND_URL } from '../constant';


const civicLikerURL = `${LIKER_LAND_URL}/civic?utm_soure=extension`;
const logoutURL = `${LIKER_LAND_URL}/logout`;

const background = browser.extension.getBackgroundPage();

class Options extends React.Component {
  handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    // TODO: add type definition
    (background as any).logout();
  }
  render() {
    return (
      <div>
        <div>
          <a href={LIKER_LAND_URL}>Go to liker.land</a>
        </div>
        <div>
          <a href={civicLikerURL}>Civic Liker</a>
        </div>
        <div>
          <a href={logoutURL} onClick={this.handleLogout}>Logout</a>
        </div>
      </div>
    )
  }
}

export default Options;
