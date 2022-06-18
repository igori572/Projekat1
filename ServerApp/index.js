const express=require('express');
const oglasiServer=require('rad-sa-oglasima');
const app=express();
const port=3000;


app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',(request,response)=>{
    response.send("Server radi");
});
app.get('/svioglasi',(request,response)=>{
    response.send(oglasiServer.sviOglasi());
});


app.post('/dodajoglas',(request,response)=>{
    oglasiServer.dodajOglas(request.body);
    response.end("Dodat oglas");
});

app.delete('/obrisioglas/:id',(request,response)=>{
    oglasiServer.obrisiOglas(request.params["id"]);
    response.end("Obrisan oglas")
});

app.put('/izmeni/:id',(request,response)=>{
    response.send(oglasiServer.promeniOglas(request.params["id"],request.body));
    response.end('Izmenjen oglas')
})

app.put('/izmeni',(request,response)=>{
    oglasiServer.promeniOglas(request.body)
    response.end('Izmenjen oglas')
})

app.get('/getoglasbykategorija',(request,response)=>{
    response.send(oglasiServer.filtrirajOglaseKategorija(request.query["kategorija"]))
});

app.get('/getoglasbyid/:id',(request,response)=>{
    response.send(oglasiServer.getOglas(request.params["id"]))
});



app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});