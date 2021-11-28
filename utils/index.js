const axios = require('axios');

const request = async (url, type = 'GET', params = null) => {
  try {
    const perms = {
      url: `${url}`,
      method: `${type}`,
      responseType: 'json'
    }

    if (type !== 'GET' && params) {
      perms.data = params
    } else if (type === 'GET' && params) {
      perms.params = params
    }

    const { data, status } = await axios(perms)
    
    if (status === 200) return data
  }
  catch(err) {
    console.error(err)
  }
};

module.exports = { request }
