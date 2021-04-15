'use strict';

const Tietokanta = require('./tietokanta');

const ohjelmavirhe = virhe => new Error('Ohjelmavirhe'+(virhe?': '+virhe:''));

const haeKaikkiSql='select kissaId,nimi,painoKg,pituus,rotu from kissa';
const haeYksi='select kissaId,nimi,painoKg,pituus,rotu from kissa where kissaId=?';
const lisaaKissa='insert into kissa (nimi,painoKg,pituus,rotu, kissaid) values(?,?,?,?,?)';
const poistaKissa='delete from kissa where kissaId=?';
const paivitaSql='update kissa set nimi=?, painoKg=?, pituus=?, rotu=? where kissaId=?';

const tiedot = kissa => [kissa.nimi, kissa.painoKg, kissa.pituus, kissa.rotu, + kissa.kissaId];

module.exports = class Kissakanta {
    constructor(optiot){
        this.varasto = new Tietokanta(optiot);
        }

        haeKaikki(){
            return new Promise( async(resolve,reject) =>  {
            try{
                const tulos = await this.varasto.suoritaKysely(haeKaikkiSql);
                if(tulos.tulosjoukko) {
                    resolve(tulos.kyselynTulos);
                }
                else {
                    reject(ohjelmavirhe());
                }
            } 
            catch(virhe){
                reject(ohjelmavirhe(virhe.message));
            }
        })
        }

        hae(kissaId) {
            return new Promise(async(resolve,reject) =>{
                try{ 
                    const tulos = await this.varasto.suoritaKysely(haeYksi, [+kissaId]);
                    if(tulos.tulosjoukko) {
                        if(tulos.kyselynTulos.length>0){
                            resolve(tulos.kyselynTulos[0]);
                        }
                        else{
                            resolve({viesti:`Numerolla ${kissaId} ei löytynyt yhtään kissaa`});
                        }
                    }
                    else {
                        reject(ohjelmavirhe('ei tulosta'));
                    }
                }
                catch(virhe){
                    reject(ohjelmavirhe(virhe.message));
                }
                
            });
        }

        lisaa(uusiKissa){
            return new Promise(async (resolve,reject)=>{
                try{
                    const hakutulos=await this.hae(uusiKissa.kissaId);
                    if(hakutulos.viesti) {
                        const tulos = await this.varasto.suoritaKysely(lisaaKissa, tiedot(uusiKissa));
                        if(tulos.kyselynTulos.muutetutRivitLkm===1){
                            resolve({viesti: 'Kissa lisättiin onnistuneesti'});
                        }
                        else {
                            resolve({viesti: 'Kissaa ei voitu lisätä'});
                        } 
                    } 
                    else {
                        resolve({viesti:`Numero ${uusiKissa.kissaId} oli jo käytössä`});
                    }
                }
                catch(virhe) {
                    reject(ohjelmavirhe(virhe.message));
                }
            });
        }

        poista(kissaId){
            return new Promise(async ( resolve, reject) =>{
                try{
                    const tulos = await this.varasto.suoritaKysely(poistaKissa, [+kissaId]);
                    if(tulos.kyselynTulos.muutetutRivitLkm===0) {
                        resolve (
                            {viesti:'Numerolla ei löydy kissaa, joten mitään ei poistettu'}
                        );
                    } 
                    else {
                        resolve({viesti:`Kissa numerolla ${kissaId} poistettiin onnistuneesti`});
                    }
                }
                catch(virhe){
                    reject(ohjelmavirhe(virhe.message));
                }
            });
        }

        paivita(kissa) {
            return new Promise(async(resolve,reject)=>{
                try {
                    const tulos = await this.varasto.suoritaKysely(paivitaSql, tiedot(kissa));
                    if(tulos.kyselynTulos.muutetutRivitLkm===0){
                        resolve({viesti: 'Tietoja ei voitu päivittää'});
                    }
                    else {
                        resolve({viesti:`Kissan ${kissa.kissaId} tiedot päivitettiin onnistuneesti`});
                    }
                }
                catch(virhe) {
                    reject(ohjelmavirhe(virhe.message));
                }
            });
        }

}