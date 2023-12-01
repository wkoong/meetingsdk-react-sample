import React, { useCallback } from 'react';

import './App.css';
import { ZoomMtg } from '@zoomus/websdk';
import { PictureInPictureProvider, usePiPWindow } from './picture-in-picture/PictureInPictureProvider';
import PiPWindow from './picture-in-picture/PictureInPictureWindow';


ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

function App() {
  var authEndpoint = 'http://localhost:4000/'
  var sdkKey = 'Gs0bjFNlSum6XCXwgv4sHA'
  var meetingNumber = '7878969529'
  var passWord = 'aFYxQW9aVTZkbWxpdXlKalc4aHNDUT09'
  var role = 1
  var userName = 'React'
  var userEmail = ''
  var registrantToken = ''
  var zakToken = ''
  var leaveUrl = 'http://localhost:3000'

  function getSignature(e) {
    e.preventDefault();

    fetch(authEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
      .then(response => {
        startMeeting(response.signature);
      }).catch(error => {
        console.error(error)
      })
  }

  async function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log('error here: ', error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  function ZoomSDK() {
    const { isSupported, requestPipWindow, pipWindow } = usePiPWindow();

    const startPiP = useCallback(() => {
      requestPipWindow(500, 500);
    }, [requestPipWindow]);

    return (
      <div>

        <button id="open-pip" onClick={startPiP} style={{ zIndex: 100000 }}>Open picture-in-picture</button>
        {pipWindow && (
          <PiPWindow pipWindow={pipWindow}>
            <div>Hello World</div>
          </PiPWindow>
        )}

      </div>
    )
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>
        <button onClick={getSignature}>Join Meeting</button>
        {/* <PictureInPictureProvider>
          <ZoomSDK />
        </PictureInPictureProvider> */}
      </main>
    </div>
  );
}

export default App;

