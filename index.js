// Create a channel (app)
// Give admin power in channel to show user settings.
// Create a chat room for a piece of content.
// Show how to enforce dedup/binding to external content using room customid

const dotenv = require('dotenv')
dotenv.config()
const sportstalk = require('sportstalk-sdk');
const management = require('./managementAPI');

// Creates a Sportstalk 24/7 "application" that uses the global user DB.
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

        // if the userid is the same, this is an update command.
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
        process.exit();
    })
}

run();