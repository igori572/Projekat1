const fs=require('fs');
const { sveKnjige } = require('radknjige-modul');
const PATH="oglasi.json";

const kategorije=[
    "automobil",
    "stan",
    "alat"
];

//kategorija,datum,cena,tekst,oznaka,email
let procitaj=()=>{
    let oglasi=fs.readFileSync(PATH,(err,data)=>{
        if(err) throw err;
            return data;
    });
    return JSON.parse(oglasi);
};

let snimiOglase=(data)=>{
    fs.writeFileSync(PATH,JSON.stringify(data));
}

exports.sviOglasi=()=>{
    return procitaj();
}

exports.dodajOglas=(noviOglas)=>{
    let id=1;
    let oglasi=this.sviOglasi();
    if(oglasi.length>0){
        id=oglasi[oglasi.length-1].id+1;
    }
    noviOglas.id=id;
    oglasi.push(noviOglas);
    snimiOglase(oglasi);
}

exports.getOglas=(id)=>{
    return this.sviOglasi().find(o=>o.id==id);
}

exports.obrisiOglas=(id)=>{
    snimiOglase(this.sviOglasi().filter(oglas=>oglas.id!=id));
}

exports.izmeniOglas=(id,oglas)=>{
    
    const brisanjeResp=this.obrisiOglas(id)
    if(brisanjeResp.err) return brisanjeResp;

    let oglasi=this.sviOglasi()
    oglas.id=id
    oglasi.push(oglas);
    snimiOglase(oglasi);
}


exports.filtrirajOglaseKategorija=(kategorija)=>{
    return this.sviOglasi().filter(oglas=>oglas.kategorija==kategorija);
}
exports.filtrirajOglaseOznaka=(oznaka)=>{
    return this.sviOglasi().filter(oglas=>oglas.oznaka.toLowerCase().includes(oznaka.toLowerCase()))
}
exports.filtrirajOglaseCena=(cena)=>{
    return this.sviOglasi().filter(oglas=>oglas.cena<=cena)
}

exports.filtrirajOglase=(kategorija,cena,oznaka)=>{
    let oglasi = procitaj();
  if (kategorija) oglasi = oglasi.filter(o => o.kategorija == kategorija);
  if (cena) oglasi = oglasi.filter(o => o.cena <= cena);
  if (oznaka)
    oglasi = oglasi.filter(o=>
      o.oznaka.toLowerCase().includes(oznaka.toLowerCase())
    );

  return oglasi;
}

