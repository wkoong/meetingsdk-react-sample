import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './App.css';
import { ZoomMtg } from '@zoomus/websdk';


ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

function App() {
  const divRef = useRef < HTMLDivElement > (null);

  useEffect(() => {
    if (divRef.current) {
      console.log('useEffect has been called')
    }
  }, [])

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
        // openPictureInPicture();
      }).catch(error => {
        console.error(error)
      })
  }

  async function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    console.log('qqq meeting number', meetingNumber)
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
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  async function openPictureInPicture() {
    const pipWindow = await window.documentPictureInPicture.requestWindow();
    document.querySelectorAll('script').forEach((script) => {
      pipWindow.document.body.appendChild(script);
    })

    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      pipWindow.document.head.appendChild(link);
    })

    // add peer dependencies, css here?
    const zoomMeeting = document.getElementById('zmmtg-root')

    console.log('qqq zooomMeeting', zoomMeeting, typeof zoomMeeting)
    // const pipDiv = pipWindow.document.createElement("div");
    // pipDiv.setAttribute("id", "pip-root");
    pipWindow.document.body.append(zoomMeeting);


    // const PIP_ROOT = createRoot(pipWindow.document.getElementById('zmmtg-root'));
    // PIP_ROOT.render(zoomMeeting);
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>

        <button onClick={getSignature}>Join Meeting</button>
        <button id="open-pip" onClick={openPictureInPicture} style={{ zIndex: 100000 }}>Open picture-in-picture</button>
      </main>
    </div>
  );
}

export default App;

