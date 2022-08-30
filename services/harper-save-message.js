var axios = require("axios");

function harperSaveMessage(message, username, room) {
  const dbUrl = "nothing"
  const dbPw = "nothing"
  if (!dbUrl || !dbPw) return null;

  var data = JSON.stringify({
    operation: "insert",
    schema: "realtime_chat_app",
    table: "messages",
    records: [
      {
        message,
        username,
        room,
      },
    ],
  });
  console.log('data======',data)
  var config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: dbPw,
    },
    data: data,
  };

  return new Promise(async(resolve, reject) => {
    await axios.post(dbUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: dbPw,
      },
    }).then((response)=>{
        console.log('success : ',response.data)
        resolve(JSON.stringify(response.data))
    }).catch((error)=>{
        reject(error)
    })
    // await axios(config)
    //   .then(function (response) {
    //     resolve(JSON.stringify(response.data));
    //   })
    //   .catch(function (error) {
    //     reject(error);
    //   });
  });
}

module.exports = harperSaveMessage;
