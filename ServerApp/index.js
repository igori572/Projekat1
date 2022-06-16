var express=require('express');
var oglasiServer=require('rad-sa-oglasima');
var app=express();
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
    response.end("OK");
});

app.delete('/obrisioglas/:id',(request,response)=>{
    oglasiServer.obrisiOglas(request.params["id"]);
    response.end("OK")
});

app.put('/izmenioglas/:id',(request,response)=>{
    response.send(oglasiServer.izmeniOglas(request.params["id"],request.body));
})
app.get('/oglasi',(request,response)=>{
    response.send(
        oglasiServer.filtrirajOglase(
            request.query.kategorija,
            request.query.cena,
            request.query.oznaka
        )
    )
})



app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});