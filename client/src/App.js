import { useState, useEffect } from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Pages/Home';
import Invite from './Pages/Invite';
import My from './Pages/My';
import Activity from './Pages/Activity';
import Investments from './Pages/Investments';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Recharge from './Pages/Recharge';
import Withdraw from './Pages/Withdraw';
import Records from './Pages/Records';
import Team from './Pages/Team';

function App() {
  const [token, setToken] = useState('')
  const [firstLoad, setFirstLoad] = useState(false)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return (
    <div className="App">
      <HashRouter>
        {!token ? (
          <Routes>
            <Route path='/' element={<Login onLogin={(prop) => {
              setToken(prop)
              setFirstLoad(true)
            }} />} />
          </Routes>
        ) : (
          <Routes>
            <Route path='/' element={<Home token={token} firstCall={firstLoad} />} />
            <Route path='/invite' element={<Invite token={token} />} />
            <Route path='/my' element={<My token={token} />} />
            <Route path='/my/investments' element={<Investments token={token} />} />
            <Route path='/activity/rewards' element={<Activity token={token} />} />
            <Route path='/recharge' element={<Recharge token={token} />} />
            <Route path='/withdraw' element={<Withdraw token={token} />} />
            <Route path='/records' element={<Records token={token} />} />
            <Route path='/team/records' element={<Team token={token} />} />
          </Routes>
        )}

        <Routes>
          <Route path='/user/login' element={<Login onLogin={(prop) => {
            setToken(prop)
            setFirstLoad(true)
          }} />} />
          <Route path='/user/register' element={<Register />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
