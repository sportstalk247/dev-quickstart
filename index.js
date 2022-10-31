// Create a channel (app)
// Give ownership of channel
// and creating a chat room for each video they have,
// or for when they create a new live stream on their end how to bind a chat room to it.

const dotenv = require('dotenv')
dotenv.config()
const sportstalk = require('sportstalk-sdk');
const management = require('./managementAPI');

// Creates a sportstalk "application" that uses the global user DB
async function createChannel(channelName) {
    const app = await management.makeApp(channelName);
    const access_token = await management.makeToken(app.id, "default");
    return {
        app,
        access_token
    }
}

async function run() {
    createChannel('MyChannel').then(async (channel) => {
        console.log(`Channel Created: ${channel.app.name}, with ID: ${channel.app.id}`);
        const config = {
            appId: channel.app.id,
            apiToken: channel.access_token,
            endpoint: process.env.API_URL,
        }
        const client = sportstalk.ChatClient.init(config);
        const adminUser = await client.createOrUpdateUser({
            userid: channel.name+'_admin',
            handle: 'admin',
            role: 'admin'
        });
        console.log(`Admin user for ${channel.app.name} has been created!`)
        // use this to enforce a link between an event and a room and for de-duplication.
        // creating a second room with the same customid will update that room with the same custom id, preventing duplicate rooms.
        const customid = 'your-custom-id-dedup';
        const yourEventRoom = await client.createRoom({
            name: 'Your live event or article',
            customid,
            description: 'This event will be amazing, you MUST watch it!'
        });
        console.log(`Chat room created!`)
        console.log(yourEventRoom);
    }).then(()=>{
        console.log("Channel built")
        process.exit();
    }).catch(e=>{
        console.log(e.message);
        console.log(e.body)
        process.exit();
    })
}
run();