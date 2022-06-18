const axios = require("axios");
const express=require("express");
const fs=require("fs");
const { request } = require("http");
const app=express();
const path=require("path");

const port=5000;

app.use(express.urlencoded({extended:false}));
app.use(express.json());

let procitajPogled=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/view/"+naziv+".html"),"utf-8");
};

app.get("/",(req,res)=>{
    res.send(procitajPogled("index"));
});

app.get("/svioglasi",(req,res)=>{
    axios.get('http://localhost:3000/svioglasi')
    .then(response=>{
        let prikaz="";
        response.data.forEach(element=>{
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.tekst}</td>
            <td>${element.cena}${element.valuta}</td>
            <td><a href="/detaljnije/${element.id}">Detaljnije</a></td>
            <td><a href="/izmeni/${element.id}">Izmeni</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
            </tr>`
        });
        res.send(procitajPogled("svioglasi").replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error);
    });
});

app.post('/izmeni',(req,res)=>{
    let mails=[]
    let oznake=[]

    if(Array.isArray(req.body.email)){
        for (let i in req.body.email){
            mails.push({
                "adresa":req.body.email[i],
                "tip":req.body.tip[i]
            })
        }
    }
    else{
        mails.push({
            "adresa":req.body.email,
            "tip":req.body.tip
        })
    }

    if(Array.isArray(req.body.oznake)){
        req.body.oznake.forEach(oz=>oznake.push(oz))
    }
    else{
        oznake.push(req.body.oznake)
    }

    axios.put("http://localhost:3000/izmeni",{
        id:parseInt(req.body.id),
        kategorija:req.body.kategorija,
        datum:req.body.datum,
        cena:parseInt(req.body.cena),
        valuta:req.body.valuta,
        tekst:req.body.tekst,
        oznaka:oznake,
        email:mails
    })
    res.redirect('/svioglasi')
})

app.get("/izmeni/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getoglasbyid/${req.params["id"]}`)
    .then(response=>{
        let oznakeHtml=''
        response.data.oznaka.forEach(oz=>{oznakeHtml+=`<br><input type="text" name="oznake" value="${oz}">`})
        let mejlic=''
        response.data.email.forEach(m=>{mejlic+=`<br><input type="email" name="email" value="${m.adresa}">
        <select name="tip" value="${m.tip}"><option value="Privatni">Privatni</option> <option value="Sluzbeni">Sluzbeni</option></select>`})
        
        let prikaz=`
        <input hidden value="${response.data.id}" name="id">
        <div>
            <label for="kategorija">Kategorija oglasa: </label>
            <select name="kategorija" id="kategorija" value="${response.data.kategorija}">
                <option value="Automobil">Automobil</option>
                <option value="Stan">Stan</option>
                <option value="Alat">Alat</option>
            </select>
        </div>
        <br>

        <div>
            <label for="datum">Datum isteka: </label>
            <input type="date" name="datum" value="${response.data.datum}">
        </div>
        <br>

        <div>
            <label for="cena">Cena</label>
            <input type="text" name="cena" value="${response.data.cena}">
            <label for="valuta">Valuta</label>
            <select name="valuta" id="valuta" value="${response.data.valuta}">
                <option value="EUR">EUR</option>
                <option value="DIN">DIN</option>
                <option value="USD">USD</option>
            </select>
        </div>
        <br>

        <div>
            <label for="tekst">Tekst oglasa: </label>
            <input type="text" name="tekst" value="${response.data.tekst}">
        </div>     
        <br>
        <button onclick="dodajOznaku()" type="button"> Dodaj oznaku</button>
        <div id="oznake" >
            ${oznakeHtml}
        </div>
        <br>
        <button onclick="dodajEmail()" type="button">Dodaj E-mail</button>
        <div id="emails">
            ${mejlic}
        </div>
        <br>
        `
        res.send(procitajPogled('izmeni').replace('#{data}',prikaz))
    }).catch(error=>{
        console.log(error);
    });
})

app.get("/detaljnije/:id",(req,res)=>{
    
    axios.get(`http://localhost:3000/getoglasbyid/${req.params["id"]}`)
    .then(response=>{
        let mejlic=''
        response.data.email.forEach(m=>{mejlic+=`<td>${m.adresa}</td><td>${m.tip}</td>`})
        let prikaz=""
            prikaz+=`<tr>
            <td>${response.data.id}</td>
            <td>${response.data.kategorija}</td>
            <td>${response.data.datum}</td>
            <td>${response.data.cena}${response.data.valuta}</td>
            <td>${response.data.tekst}</td>
            <td>${response.data.oznaka}</td>
            <td>${mejlic}</td>
            <td><a href="/izmeni/${response.data.id}">Izmeni</a></td>
            <td><a href="/obrisi/${response.data.id}">Obrisi</a></td>
            </tr>`;
        
        res.send(procitajPogled("detaljnije").replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error);
    });
});

app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/obrisiOglas/${req.params["id"]}`)
    res.redirect("/svioglasi");
})

app.get("/dodajoglas",(req,res)=>{
    res.send(procitajPogled("dodavanje"));
});
app.post("/snimioglas",(req,res)=>{
    let mails=[]
    let oznake=[]

    if(Array.isArray(req.body.email)){
        for (let i in req.body.email){
            mails.push({
                "adresa":req.body.email[i],
                "tip":req.body.tip[i]
            })
        }
    }
    else{
        mails.push({
            "adresa":req.body.email,
            "tip":req.body.tip
        })
    }

    if(Array.isArray(req.body.oznake)){
        req.body.oznake.forEach(oz=>oznake.push(oz))
    }
    else{
        oznake.push(req.body.oznake)
    }

    axios.post("http://localhost:3000/dodajoglas",{
        kategorija:req.body.kategorija,
        datum:req.body.datum,
        cena:req.body.cena,
        valuta:req.body.valuta,
        tekst:req.body.tekst,
        oznaka:oznake,
        email:mails
    })
    res.redirect("/svioglasi")
});

app.post("/filtrirajkategoriju",(req,res)=>{
    axios.get(`http://localhost:3000/getoglasbykategorija?kategorija=${req.body.kategorija}`)
    .then(response=>{
        let mejlic=''
        response.data.email.forEach(m=>{mejlic+=`<td>${m.adresa}</td><td>${m.tip}</td>`})
        let prikaz=""
        response.data.forEach(element=>{
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.datum}</td>
            <td>${element.cena}${element.valuta}</td>
            <td>${element.tekst}</td>
            <td>${element.oznaka}</td>
            <td>${mejlic}</td>
            <td><a href="/izmeni/${element.id}">Izmeni</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
            </tr>`
        });
        res.send(procitajPogled("svioglasi").replace("#{data}",prikaz));
    })
});

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});