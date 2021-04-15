'use strict';

const http = require('http');
const express = require('express');
const cors = require('cors');
const  Tietovarasto = require('./kissavarasto');


const app = express();

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

const palvelin = http.createServer(app);

const optiot = {
    host:'localhost',
    port: 3306,
    user: 'asta',
    password: 'QqNxrkW6',
    database: 'kissatietokanta'

};

const kissat  = new Tietovarasto(optiot);


app.use(express.json());
app.use(cors());

app.get('/', (req,res)=> res.json({virhe: 'Resurssi puuttuu :('}));

app.get('/api/kissat', (req,res)=> kissat.haeKaikki().then(tulos => res.json(tulos)).catch(virhe => res.json({virhe:virhe.message})));

app.route('/api/kissat/:numero').get((req,res) => 
    {const kissaId = req.params.numero; kissat.hae(kissaId).then(tulos => res.json(tulos)).catch(virhe => res.json({virhe:virhe.message}))})

    .put((req,res)=>{
        if(!req.res) {
            res.json({virhe:'tietoja ei löydy'});
        } 
        else {
            const kissaId= req.params.numero;
            if(req.body.kissaId!=kissaId) {
                req.json({virhe: 'virheellinen resurssi'});

            } 
            else {
                kissat.lisaa(req.body).then(tulos => res.json(tulos)).catch(virhe => res.json({virhe:virhe.message}));
            }
        }
    })

    .post((req,res) =>{
        if(!req.body){
            res.json({virhe: ' tietoja ei löydy'});
        }
        else {
            const kissaId = req.params.numero;
            if(req.body.kissaId!=kissaId) {
                req.json({virhe:'virheellinen resurssi'});
            }
            else {
                kissat.paivita(req.body).then(tulos => res.json(tulos)).catch(virhe => res.json({virhe:virhe.message}));
            }
        }
    }) 

    .delete((req,res) =>{
        const kissaId = req.params.numero; 
        kissat.poista(kissaId).then(tulos => res.json(tulos)).catch(virhe=>res.json({virhe:virhe.message}))
    });

    app.all('*',(req,res)=>res.json({virhe:'resurssia ei löydy :('}));

palvelin.listen(port,host,()=>console.log(`Palvelin ${host} portissa ${port}`));