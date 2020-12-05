const helper = require('./helper')

// USE this: helper.isQualifying

all_links = []

start_link = "https://www.facebook.com/burgerking"

function get_links(start_link){
    axios.get(start_link).then(res => {
        console.log(`Checking ${url}`)
        const html = res.data.toString()
        const temp_links = zoltan_fun(html).filter(e => !all_links.includes(e))
        all_links.concat(temp_links)
        temp_links.forEach(get_links);
    });
}