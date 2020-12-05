const helper = require('./helper')
const axios = require('axios')

// USE this: helper.isQualifying

all_links = []

start = "https://www.facebook.com/burgerking"

function get_links(start_link){
    axios.get(start_link).then(res => {
        console.log(`Checking ${start_link}`)
        const html = res.data.toString()
        const temp_links = helper.getPageLinks(html).filter(e => !all_links.includes(e))
        all_links.concat(temp_links)
        console.log(all_links)
        if(temp_links.length > 0){
         temp_links.forEach(get_links);
        }
    });
}

get_links(start)
