drop database if exists kissatietokanta;
create database kissatietokanta;
use kissatietokanta;
create table kissa(
    kissaId integer not null primary key,
    nimi varchar(15) not null,
    painoKg integer not null,
    pituus integer not null,
    rotu varchar(19) not null
);

insert into kissa values(1,'Bruno',7 ,30 ,'Maine Coon');
insert into kissa values(2,'Mirre',5 ,28 ,'Burma');
insert into kissa values(3,'Kalle',4 ,26 ,'Siiamilainen');


drop user if exists 'asta'@'localhost';
create user if not exists 'asta'@'localhost' identified by 'QqNxrkW6';
grant all privileges on kissatietokanta.* to 'asta'@'localhost';