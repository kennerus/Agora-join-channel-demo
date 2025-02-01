import AgoraRTC from 'agora-rtc-sdk-ng';

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
};

let options = {
  appId: 'e2cafe65960e42deac7181c71a60fd85',
  channel: 'meeting-test-channel',
  token: '007eJxTYCi16Fmz2nm5n1Chw4NFpfql8zaGZ7+zPL3g9UTOlzY5FxcrMKQaJSempZqZWpoZpJoYpaQmJpsbWhgCiUQzg7QUC9OLH+amNwQyMszNNGNkZIBAEF+EITc1tSQzL123JLW4RDc5IzEvLzWHgQEA9a4nUA==',
  uid: '1',
};

function createClient() {
  return AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8',  });
}

function join() {
  return rtc.client.join(
    options.appId,
    options.channel,
    options.token,
    options.uid,
  );
}

function createClientAndJoin() {
  rtc.client = createClient();
  join();
}

// Initialize the AgoraRTC client
function initializeClient() {
  rtc.client = createClient();

  setupEventListeners();
}

// Handle remote user events
function setupEventListeners() {
  rtc.client.on('user-published', async (user, mediaType) => {
    await rtc.client.subscribe(user, mediaType);
    console.log('subscribe success');

    if (mediaType === 'video') {
      displayRemoteVideo(user);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  });

  rtc.client.on('user-unpublished', (user) => {
    const remotePlayerContainer = document.getElementById(user.uid);
    remotePlayerContainer && remotePlayerContainer.remove();
  });
}


// Display remote video
function displayRemoteVideo(user) {
  const remoteVideoTrack = user.videoTrack;
  const remotePlayerContainer = document.createElement('div');
  remotePlayerContainer.id = user.uid.toString();
  remotePlayerContainer.textContent = `Remote user ${user.uid}`;
  remotePlayerContainer.style.width = '640px';
  remotePlayerContainer.style.height = '480px';
  document.body.append(remotePlayerContainer);
  remoteVideoTrack.play(remotePlayerContainer);
}

// Join a channel and publish local media
async function joinChannel() {
  await join();
  await createAndPublishLocalTracks();
  displayLocalVideo();
  console.log('Publish success!');
}

// Publish local audio and video tracks
async function createAndPublishLocalTracks() {
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
}

// Display local video
function displayLocalVideo() {
  const localPlayerContainer = document.createElement('div');
  localPlayerContainer.id = options.uid;
  localPlayerContainer.textContent = `Local user ${options.uid}`;
  localPlayerContainer.style.width = '640px';
  localPlayerContainer.style.height = '480px';
  document.body.append(localPlayerContainer);
  rtc.localVideoTrack.play(localPlayerContainer);
}

// Leave the channel and clean up
async function leaveChannel() {
  // Close local tracks
  rtc.localAudioTrack.close();
  rtc.localVideoTrack.close();

  // Remove local video container
  const localPlayerContainer = document.getElementById(options.uid);
  localPlayerContainer && localPlayerContainer.remove();

  // Remove all remote video containers
  rtc.client.remoteUsers.forEach((user) => {
    const playerContainer = document.getElementById(user.uid);
    playerContainer && playerContainer.remove();
  });

  // Leave the channel
  await rtc.client.leave();
}

// Set up button click handlers
function setupButtonHandlers() {
  document.getElementById('join-channel').onclick = createClientAndJoin;
  document.getElementById('join').onclick = joinChannel;
  document.getElementById('leave').onclick = leaveChannel;
}

// Start the basic call
function startBasicCall() {
  initializeClient();
  window.onload = setupButtonHandlers;
}

startBasicCall();
