import React,{useEffect} from 'react'
import './Navbar.css'
import Identicon from 'identicon.js'
import CameraAltIcon from '@material-ui/icons/Camera';

export function Navbar({Account}) {
    return (
        <div>
            <nav className="navbar navbar-green bg-dark flex-md-nowrap p-0 shadow nav_2">
                <a className="navbar-brand nav_1" href="#">
                    <CameraAltIcon className="camera"/>
                    <b className="dpixel">DpiXels</b>
                </a>
                <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-sm-block">
            <small className="text-secondary">
              <small id="account" className="text">{Account}</small>
            </small>
            { Account
              ? <img
                className='img'
                width='35'
                height='35'
                src={`data:image/png;base64,${new Identicon(Account, 720).toString()}`}
              />
              : <span></span>
            }
          </li>
        </ul>
            </nav>
        </div>
    )
}

export default Navbar;