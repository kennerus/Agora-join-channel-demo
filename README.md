1. Clone demo `git clone https://github.com/kennerus/Agora-join-channel-demo.git`
2. Do `npm install` in root directory
3. Do `npm run dev`

The 'Join Channel' button only creates the client and tries to join the channel. However, the client cannot join the channel unless at least one media device track is created.
The 'Join Channel and Publish Video' button creates the client, joins the channel, gets access to the media devices, and publishes them to the channel. That flow works just fine.
