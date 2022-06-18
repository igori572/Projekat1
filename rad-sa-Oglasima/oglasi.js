const fs=require('fs');
const PATH="oglasi.json";

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

exports.promeniOglas=(oglas)=>{
    let oglasi=this.sviOglasi();
    oglasi[oglasi.findIndex(o => o.id == oglas.id)]=oglas
    //console.log(oglasi.findIndex(o => o.id == oglas.id))
    snimiOglase(oglasi);
}


exports.filtrirajOglaseKategorija=(kategorija)=>{
    return this.sviOglasi().filter(oglas=>oglas.kategorija==kategorija);
}


