const axios = require("axios");
const { response } = require("express");
const express=require("express");
const fs=require("fs");
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
            <td>${element.cena}</td>
            <td><a href="/detaljnije/${element.id}">Detaljnije</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
            </tr>`
        });
        res.send(procitajPogled("svioglasi").replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error);
    });
});

app.get("/detaljnije/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getoglasbyid/${req.params["id"]}`)
    .then(response=>{
        let prikaz=""
        prikaz+=`<tr>
        <td>${response.data.id}</td>
        <td>${response.data.kategorija}</td>
        <td>${response.data.datum}</td>
        <td>${response.data.cena}</td>
        <td>${response.data.tekst}</td>
        <td>${response.data.oznaka}</td>
        <td>${response.data.email}</td>
        <td><a href="/obrisi/${response.data.id}">Obrisi</a></td>
        </tr>`;
        res.send(procitajPogled("svioglasi").replace("#{data}",prikaz))
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
    axios.post("http://localhost:3000/dodajoglas",{
        kategorija:req.body.kategorija,
        datum:req.body.datum,
        cena:req.body.cena,
        tekst:req.body.tekst,
        oznaka:req.body.oznaka,
        email:req.body.email
    })
    res.redirect("/svioglasi")
});

app.post("/filtrirajkategoriju",(req,res)=>{
    axios.get(`http://localhost:3000/getoglasbykategorija?kategorija=${req.body.kategorija}`)
    .then(response=>{
        response.data.forEach(element=>{
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.datum}</td>
            <td>${element.cena}</td>
            <td>${element.tekst}</td>
            <td>${element.oznaka}</td>
            <td>${element.email}</td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
            </tr>`
        });
        res.send(procitajPogled("svioglasi").replace("#{data}",prikaz));
    })
});

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});