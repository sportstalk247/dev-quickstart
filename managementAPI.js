const request = require('request-promise-native');
const contentTypes = {
    json: 'application/json',
    encoded: 'application/x-www-form-urlencoded'
}

const HTTPMethods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

const API = process.env.API_URL;
const MANAGEMENT_TOKEN = process.env.MANAGEMENT_TOKEN;
const ORGANIZATION_ID = process.env.ORGANIZATION_ID;
const OWNER_ACCOUNT = process.env.OWNER_ACCOUNT;

const mAPI = async function callManagementApi(url, values, method = HTTPMethods.POST, contentType = contentTypes.encoded) {
    const config = {
        uri: `${API}/${url}`,
        method: method || HTTPMethods.POST,
        headers: {
            'Content-Type': contentType,
            'x-manage-token': MANAGEMENT_TOKEN
        },
        json: true,
    };
    if (values && contentType === contentTypes.encoded) {
        config.form = values;
    } else if (values) {
        config.json = values;
    }
    return request(config);
};

// Can create permission limited tokens to grant limited control to channels.
const makeToken = async function makeToken(applicationid, token_description, permissionsList) {
    const api_result = await mAPI('/manage/createtoken', { applicationid,
        name: token_description || "default",
        permissions: permissionsList || ["chatcreateroom", "chatupdateroom", "chatdeleteroom", "chatmoderatequeues", "chatpurgemessages", "chatmoderateusers", "chatspeech", "chatreactions", "chatexecutecommand", "chatlistrooms", "chatdeleteevent", "commentcreateconversation", "commentmoderateusers", "commentdeleteconversation", "commentpurgecomments", "commentpostcomment", "commentdeletecomment","commentreactions", "commentreport"]
    });
    return api_result.data.token;
};

const makeApp = async function makeApp(appName, userreportslimit = 5) {
    const api_result = await mAPI('/manage/createapplication', {
        userreportslimit,
        accountid: OWNER_ACCOUNT,
        name: appName,
        organizationid: ORGANIZATION_ID,
        useorganizationuserdatabase: true,
    });
    return api_result.data;
};


module.exports = {
    mAPI,
    makeApp,
    makeToken,
}