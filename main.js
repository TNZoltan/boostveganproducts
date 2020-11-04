const axios = require("axios")

const pageList = {
  global: [
    "https://www.facebook.com/subway",
    "https://www.facebook.com/burgerking",
    "https://www.facebook.com/Starbucks",
    "https://www.facebook.com/CostaCoffee"

  ],
  ireland: [
    "https://www.facebook.com/FourStarPizzaIRE",
    "https://www.facebook.com/McDonaldsIreland",
    "https://www.facebook.com/IrelandKFC"
  ],
  poland: [
    "https://www.facebook.com/saladstory",
    "https://www.facebook.com/tarczynskipl/",
    "https://www.facebook.com/grycan/",
    "https://www.facebook.com/BigMilkPL/",
    "https://www.facebook.com/CarrefourPolska",
    "https://www.facebook.com/BiedronkaCodziennie",
    "https://www.facebook.com/zabkapolska",
    "https://www.facebook.com/orlenstopcafe",
    "https://www.facebook.com/ORLENOfficial/",
    "https://www.facebook.com/bp.polska/",
    "https://www.facebook.com/ShellPolska/",
    "https://www.facebook.com/EtnoCafeKawiarnie",
    "https://www.facebook.com/mlekpol",
    "https://www.facebook.com/MLEKOVITA",
    "https://www.facebook.com/maxburgerspolska/",
    "https://www.facebook.com/czekolada",
    "https://www.facebook.com/PijalnieCzekolady",
    "https://www.facebook.com/sklepy.stokrotka",
    "https://www.facebook.com/kaufland.polska",
    "https://www.facebook.com/WawelSlodycze",
    "https://www.facebook.com/majonezkielecki",
    "https://www.facebook.com/PizzaDominiumPL",
    "https://www.facebook.com/restauracjaThaiWok",
    "https://www.facebook.com/pizzahutpolska",
    "https://www.facebook.com/auchan.retail.polska",
    "https://www.facebook.com/lidlpolska",
    "https://www.facebook.com/Bakoma.online",
    "https://www.facebook.com/PiatnicaOSM/",
    "https://www.facebook.com/MagnumPolska/",
    "https://www.facebook.com/benandjerryspl",
    "https://www.facebook.com/MilkaPoland/",
    "https://www.facebook.com/virtuozismaku/",
    "https://www.facebook.com/PizzaGuseppe",
    "https://www.facebook.com/NestlePL",
    "https://www.facebook.com/DrOetkerPolska",
    "https://www.facebook.com/frosta.polska",
    "https://www.facebook.com/sokolowfanpage",
    "https://www.facebook.com/Zielona.Budka.1947",
    "https://www.facebook.com/NorthFishPL",
    "https://www.facebook.com/KebabKingKrolKebabow",
    "https://www.facebook.com/Nicecreampl",
    "https://www.facebook.com/KinderPoland",
    "https://www.facebook.com/HariboPolska",
    "https://www.facebook.com/LindtPolska",
    "https://www.facebook.com/GalbaniPolska"
  ],
  sweden: [
    "https://www.facebook.com/Willys",
    "https://www.facebook.com/ICA",
    "https://www.facebook.com/marabou/",
    "https://www.facebook.com/ArlaGdansk",
    "https://www.facebook.com/Pressbyran",
    "https://www.facebook.com/Ballerina",
    "https://www.facebook.com/Kronfagel",
    "https://www.facebook.com/McVitiesSverige",
    "https://www.facebook.com/OLW",
    "https://www.facebook.com/estrellasverige",
    "https://www.facebook.com/Cloetta",
    "https://www.facebook.com/orklasverige",
    "https://www.facebook.com/felix",
    "https://www.facebook.com/philadelphia.sverige",
    "https://www.facebook.com/apetina",
    "https://www.facebook.com/kesosverige",
    "https://www.facebook.com/yoggisverige",
    "https://www.facebook.com/svensktsmor/",
    "https://www.facebook.com/scan",
    "https://www.facebook.com/pekapotatis"
  ],
  germany: [
    "https://www.facebook.com/RamaDE"
  ]
}

const wordList = {
  global: ["Vegan", "vegan", "VEGAN", "plant-based", "plantbased", "Plant-based", "Plantbased"],
  poland: [
    "wegański", "wegańska", "wegańskie", "weganie", "wegan", "weganizm", "wegańskich", "roślinny", "roślinna", "roślinne", "roślinnych",
    "Wegański", "Wegańska", "Wegańskie", "Weganie", "Wegan", "Weganizm", "Wegańskich", "Roślinny", "Roślinna", "Roślinne", "Roślinnych"
  ]
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const siteHasVeganPost = (siteUrl, country) => {
  return axios.get(siteUrl).then(res => {
    const site = res.data.toString()
    for (let i = 0; i < wordList.global.length; ++i)
      if (site.indexOf(wordList.global[i]) > 0) return wordList.global[i]
    if (country !== 'global' && wordList[country])
      for (let i = 0; i < wordList[country].length; ++i)
        if (site.indexOf(wordList[country][i]) > 0) return wordList[country][i]
    return false
  })
};


for (const country in pageList) {
  for (let i = 0; i < pageList[country].length; ++i) {
    setTimeout(() => siteHasVeganPost(pageList[country][i], country).then(word => {
      if (word) console.log(`Word ${word} was found on ${pageList[country][i]} from ${capitalize(country)}`)
    }), 2000)
  }
}


