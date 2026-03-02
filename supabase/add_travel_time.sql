-- Přidání sloupce travel_time_min do tabulky distances
ALTER TABLE distances ADD COLUMN IF NOT EXISTS travel_time_min INTEGER NOT NULL DEFAULT 60;

-- Aktualizace časů jízdy podle reálných navigačních dat
-- Krajská města (dálnice = rychlejší)
UPDATE distances SET travel_time_min = 65 WHERE end_city = 'Praha';
UPDATE distances SET travel_time_min = 175 WHERE end_city = 'Brno';
UPDATE distances SET travel_time_min = 240 WHERE end_city = 'Ostrava';
UPDATE distances SET travel_time_min = 105 WHERE end_city = 'Plzeň';
UPDATE distances SET travel_time_min = 75 WHERE end_city = 'Liberec';
UPDATE distances SET travel_time_min = 195 WHERE end_city = 'Olomouc';
UPDATE distances SET travel_time_min = 160 WHERE end_city = 'České Budějovice';
UPDATE distances SET travel_time_min = 100 WHERE end_city = 'Hradec Králové';
UPDATE distances SET travel_time_min = 110 WHERE end_city = 'Pardubice';
UPDATE distances SET travel_time_min = 215 WHERE end_city = 'Zlín';
UPDATE distances SET travel_time_min = 145 WHERE end_city = 'Jihlava';
UPDATE distances SET travel_time_min = 70 WHERE end_city = 'Karlovy Vary';

-- Ústecký kraj
UPDATE distances SET travel_time_min = 30 WHERE end_city = 'Děčín';
UPDATE distances SET travel_time_min = 20 WHERE end_city = 'Teplice';
UPDATE distances SET travel_time_min = 30 WHERE end_city = 'Most';
UPDATE distances SET travel_time_min = 40 WHERE end_city = 'Chomutov';
UPDATE distances SET travel_time_min = 25 WHERE end_city = 'Litoměřice';
UPDATE distances SET travel_time_min = 40 WHERE end_city = 'Louny';
UPDATE distances SET travel_time_min = 30 WHERE end_city = 'Roudnice nad Labem';
UPDATE distances SET travel_time_min = 22 WHERE end_city = 'Lovosice';
UPDATE distances SET travel_time_min = 22 WHERE end_city = 'Bílina';
UPDATE distances SET travel_time_min = 35 WHERE end_city = 'Litvínov';
UPDATE distances SET travel_time_min = 50 WHERE end_city = 'Kadaň';
UPDATE distances SET travel_time_min = 48 WHERE end_city = 'Žatec';
UPDATE distances SET travel_time_min = 38 WHERE end_city = 'Jirkov';
UPDATE distances SET travel_time_min = 52 WHERE end_city = 'Klášterec nad Ohří';
UPDATE distances SET travel_time_min = 15 WHERE end_city = 'Krupka';
UPDATE distances SET travel_time_min = 25 WHERE end_city = 'Duchcov';
UPDATE distances SET travel_time_min = 28 WHERE end_city = 'Osek';
UPDATE distances SET travel_time_min = 55 WHERE end_city = 'Podbořany';
UPDATE distances SET travel_time_min = 50 WHERE end_city = 'Rumburk';
UPDATE distances SET travel_time_min = 55 WHERE end_city = 'Varnsdorf';
UPDATE distances SET travel_time_min = 52 WHERE end_city = 'Šluknov';
UPDATE distances SET travel_time_min = 35 WHERE end_city = 'Benešov nad Ploučnicí';
UPDATE distances SET travel_time_min = 40 WHERE end_city = 'Česká Kamenice';
UPDATE distances SET travel_time_min = 30 WHERE end_city = 'Třebenice';
UPDATE distances SET travel_time_min = 28 WHERE end_city = 'Štětí';
UPDATE distances SET travel_time_min = 10 WHERE end_city = 'Povrly';
UPDATE distances SET travel_time_min = 8 WHERE end_city = 'Velké Březno';
UPDATE distances SET travel_time_min = 10 WHERE end_city = 'Chabařovice';
UPDATE distances SET travel_time_min = 15 WHERE end_city = 'Chlumec';

-- Středočeský kraj
UPDATE distances SET travel_time_min = 60 WHERE end_city = 'Kladno';
UPDATE distances SET travel_time_min = 65 WHERE end_city = 'Mladá Boleslav';
UPDATE distances SET travel_time_min = 85 WHERE end_city = 'Kolín';
UPDATE distances SET travel_time_min = 95 WHERE end_city = 'Kutná Hora';
UPDATE distances SET travel_time_min = 45 WHERE end_city = 'Mělník';
UPDATE distances SET travel_time_min = 75 WHERE end_city = 'Beroun';
UPDATE distances SET travel_time_min = 100 WHERE end_city = 'Příbram';
UPDATE distances SET travel_time_min = 95 WHERE end_city = 'Benešov';
UPDATE distances SET travel_time_min = 75 WHERE end_city = 'Nymburk';
UPDATE distances SET travel_time_min = 70 WHERE end_city = 'Rakovník';
UPDATE distances SET travel_time_min = 50 WHERE end_city = 'Slaný';
UPDATE distances SET travel_time_min = 42 WHERE end_city = 'Kralupy nad Vltavou';
UPDATE distances SET travel_time_min = 48 WHERE end_city = 'Neratovice';
UPDATE distances SET travel_time_min = 58 WHERE end_city = 'Brandýs nad Labem';
UPDATE distances SET travel_time_min = 75 WHERE end_city = 'Poděbrady';
UPDATE distances SET travel_time_min = 80 WHERE end_city = 'Říčany';
UPDATE distances SET travel_time_min = 105 WHERE end_city = 'Čáslav';
UPDATE distances SET travel_time_min = 68 WHERE end_city = 'Lysá nad Labem';
UPDATE distances SET travel_time_min = 78 WHERE end_city = 'Český Brod';
UPDATE distances SET travel_time_min = 62 WHERE end_city = 'Mnichovo Hradiště';
UPDATE distances SET travel_time_min = 110 WHERE end_city = 'Vlašim';
UPDATE distances SET travel_time_min = 110 WHERE end_city = 'Sedlčany';
UPDATE distances SET travel_time_min = 90 WHERE end_city = 'Dobříš';
UPDATE distances SET travel_time_min = 80 WHERE end_city = 'Hořovice';
UPDATE distances SET travel_time_min = 115 WHERE end_city = 'Votice';

-- Liberecký kraj
UPDATE distances SET travel_time_min = 80 WHERE end_city = 'Jablonec nad Nisou';
UPDATE distances SET travel_time_min = 50 WHERE end_city = 'Česká Lípa';
UPDATE distances SET travel_time_min = 90 WHERE end_city = 'Semily';
UPDATE distances SET travel_time_min = 82 WHERE end_city = 'Turnov';
UPDATE distances SET travel_time_min = 45 WHERE end_city = 'Nový Bor';
UPDATE distances SET travel_time_min = 88 WHERE end_city = 'Tanvald';
UPDATE distances SET travel_time_min = 82 WHERE end_city = 'Železný Brod';
UPDATE distances SET travel_time_min = 95 WHERE end_city = 'Jilemnice';
UPDATE distances SET travel_time_min = 100 WHERE end_city = 'Rokytnice nad Jizerou';
UPDATE distances SET travel_time_min = 110 WHERE end_city = 'Harrachov';
UPDATE distances SET travel_time_min = 85 WHERE end_city = 'Frýdlant';
UPDATE distances SET travel_time_min = 78 WHERE end_city = 'Hrádek nad Nisou';
UPDATE distances SET travel_time_min = 48 WHERE end_city = 'Zákupy';
UPDATE distances SET travel_time_min = 55 WHERE end_city = 'Mimoň';
UPDATE distances SET travel_time_min = 58 WHERE end_city = 'Doksy';

-- Královéhradecký kraj
UPDATE distances SET travel_time_min = 115 WHERE end_city = 'Trutnov';
UPDATE distances SET travel_time_min = 125 WHERE end_city = 'Náchod';
UPDATE distances SET travel_time_min = 88 WHERE end_city = 'Jičín';
UPDATE distances SET travel_time_min = 130 WHERE end_city = 'Rychnov nad Kněžnou';
UPDATE distances SET travel_time_min = 105 WHERE end_city = 'Dvůr Králové nad Labem';
UPDATE distances SET travel_time_min = 110 WHERE end_city = 'Vrchlabí';
UPDATE distances SET travel_time_min = 110 WHERE end_city = 'Jaroměř';
UPDATE distances SET travel_time_min = 95 WHERE end_city = 'Nová Paka';
UPDATE distances SET travel_time_min = 92 WHERE end_city = 'Hořice';
UPDATE distances SET travel_time_min = 140 WHERE end_city = 'Broumov';
UPDATE distances SET travel_time_min = 125 WHERE end_city = 'Špindlerův Mlýn';
UPDATE distances SET travel_time_min = 130 WHERE end_city = 'Pec pod Sněžkou';
UPDATE distances SET travel_time_min = 130 WHERE end_city = 'Dobruška';
UPDATE distances SET travel_time_min = 122 WHERE end_city = 'Nové Město nad Metují';
UPDATE distances SET travel_time_min = 130 WHERE end_city = 'Police nad Metují';
UPDATE distances SET travel_time_min = 132 WHERE end_city = 'Kostelec nad Orlicí';
UPDATE distances SET travel_time_min = 112 WHERE end_city = 'Hostinné';
UPDATE distances SET travel_time_min = 80 WHERE end_city = 'Chlumec nad Cidlinou';

-- Pardubický kraj
UPDATE distances SET travel_time_min = 120 WHERE end_city = 'Chrudim';
UPDATE distances SET travel_time_min = 145 WHERE end_city = 'Svitavy';
UPDATE distances SET travel_time_min = 135 WHERE end_city = 'Ústí nad Orlicí';
UPDATE distances SET travel_time_min = 140 WHERE end_city = 'Litomyšl';
UPDATE distances SET travel_time_min = 130 WHERE end_city = 'Vysoké Mýto';
UPDATE distances SET travel_time_min = 105 WHERE end_city = 'Přelouč';
UPDATE distances SET travel_time_min = 118 WHERE end_city = 'Holice';
UPDATE distances SET travel_time_min = 148 WHERE end_city = 'Lanškroun';
UPDATE distances SET travel_time_min = 155 WHERE end_city = 'Polička';
UPDATE distances SET travel_time_min = 132 WHERE end_city = 'Choceň';
UPDATE distances SET travel_time_min = 160 WHERE end_city = 'Moravská Třebová';
UPDATE distances SET travel_time_min = 142 WHERE end_city = 'Česká Třebová';
UPDATE distances SET travel_time_min = 140 WHERE end_city = 'Letohrad';
UPDATE distances SET travel_time_min = 162 WHERE end_city = 'Králíky';
UPDATE distances SET travel_time_min = 142 WHERE end_city = 'Žamberk';
UPDATE distances SET travel_time_min = 140 WHERE end_city = 'Hlinsko';

-- Karlovarský kraj
UPDATE distances SET travel_time_min = 100 WHERE end_city = 'Cheb';
UPDATE distances SET travel_time_min = 82 WHERE end_city = 'Sokolov';
UPDATE distances SET travel_time_min = 92 WHERE end_city = 'Mariánské Lázně';
UPDATE distances SET travel_time_min = 105 WHERE end_city = 'Františkovy Lázně';
UPDATE distances SET travel_time_min = 120 WHERE end_city = 'Aš';
UPDATE distances SET travel_time_min = 62 WHERE end_city = 'Ostrov';
UPDATE distances SET travel_time_min = 95 WHERE end_city = 'Kraslice';
UPDATE distances SET travel_time_min = 75 WHERE end_city = 'Chodov';
UPDATE distances SET travel_time_min = 70 WHERE end_city = 'Jáchymov';
UPDATE distances SET travel_time_min = 72 WHERE end_city = 'Nejdek';
UPDATE distances SET travel_time_min = 80 WHERE end_city = 'Horní Slavkov';
UPDATE distances SET travel_time_min = 72 WHERE end_city = 'Loket';
UPDATE distances SET travel_time_min = 78 WHERE end_city = 'Bečov nad Teplou';
UPDATE distances SET travel_time_min = 82 WHERE end_city = 'Toužim';
UPDATE distances SET travel_time_min = 88 WHERE end_city = 'Habartov';
UPDATE distances SET travel_time_min = 82 WHERE end_city = 'Kynšperk nad Ohří';

-- Plzeňský kraj
UPDATE distances SET travel_time_min = 140 WHERE end_city = 'Klatovy';
UPDATE distances SET travel_time_min = 135 WHERE end_city = 'Domažlice';
UPDATE distances SET travel_time_min = 110 WHERE end_city = 'Tachov';
UPDATE distances SET travel_time_min = 95 WHERE end_city = 'Rokycany';
UPDATE distances SET travel_time_min = 155 WHERE end_city = 'Sušice';
UPDATE distances SET travel_time_min = 150 WHERE end_city = 'Horažďovice';
UPDATE distances SET travel_time_min = 118 WHERE end_city = 'Stod';
UPDATE distances SET travel_time_min = 105 WHERE end_city = 'Stříbro';
UPDATE distances SET travel_time_min = 110 WHERE end_city = 'Planá';
UPDATE distances SET travel_time_min = 112 WHERE end_city = 'Nýřany';
UPDATE distances SET travel_time_min = 125 WHERE end_city = 'Přeštice';
UPDATE distances SET travel_time_min = 132 WHERE end_city = 'Kdyně';
UPDATE distances SET travel_time_min = 125 WHERE end_city = 'Blovice';
UPDATE distances SET travel_time_min = 132 WHERE end_city = 'Nepomuk';
UPDATE distances SET travel_time_min = 130 WHERE end_city = 'Horšovský Týn';
UPDATE distances SET travel_time_min = 95 WHERE end_city = 'Kralovice';

-- Jihočeský kraj
UPDATE distances SET travel_time_min = 125 WHERE end_city = 'Tábor';
UPDATE distances SET travel_time_min = 148 WHERE end_city = 'Písek';
UPDATE distances SET travel_time_min = 155 WHERE end_city = 'Strakonice';
UPDATE distances SET travel_time_min = 185 WHERE end_city = 'Prachatice';
UPDATE distances SET travel_time_min = 195 WHERE end_city = 'Český Krumlov';
UPDATE distances SET travel_time_min = 170 WHERE end_city = 'Jindřichův Hradec';
UPDATE distances SET travel_time_min = 175 WHERE end_city = 'Třeboň';
UPDATE distances SET travel_time_min = 142 WHERE end_city = 'Soběslav';
UPDATE distances SET travel_time_min = 150 WHERE end_city = 'Blatná';
UPDATE distances SET travel_time_min = 155 WHERE end_city = 'Týn nad Vltavou';
UPDATE distances SET travel_time_min = 142 WHERE end_city = 'Milevsko';
UPDATE distances SET travel_time_min = 180 WHERE end_city = 'Vimperk';
UPDATE distances SET travel_time_min = 200 WHERE end_city = 'Volary';
UPDATE distances SET travel_time_min = 185 WHERE end_city = 'Dačice';
UPDATE distances SET travel_time_min = 160 WHERE end_city = 'Veselí nad Lužnicí';
UPDATE distances SET travel_time_min = 188 WHERE end_city = 'Kaplice';
UPDATE distances SET travel_time_min = 205 WHERE end_city = 'Vyšší Brod';
UPDATE distances SET travel_time_min = 192 WHERE end_city = 'Nové Hrady';
UPDATE distances SET travel_time_min = 180 WHERE end_city = 'Trhové Sviny';
UPDATE distances SET travel_time_min = 170 WHERE end_city = 'Lomnice nad Lužnicí';

-- Vysočina
UPDATE distances SET travel_time_min = 128 WHERE end_city = 'Havlíčkův Brod';
UPDATE distances SET travel_time_min = 140 WHERE end_city = 'Pelhřimov';
UPDATE distances SET travel_time_min = 155 WHERE end_city = 'Žďár nad Sázavou';
UPDATE distances SET travel_time_min = 175 WHERE end_city = 'Třebíč';
UPDATE distances SET travel_time_min = 118 WHERE end_city = 'Humpolec';
UPDATE distances SET travel_time_min = 165 WHERE end_city = 'Velké Meziříčí';
UPDATE distances SET travel_time_min = 122 WHERE end_city = 'Světlá nad Sázavou';
UPDATE distances SET travel_time_min = 135 WHERE end_city = 'Chotěboř';
UPDATE distances SET travel_time_min = 165 WHERE end_city = 'Bystřice nad Pernštejnem';
UPDATE distances SET travel_time_min = 175 WHERE end_city = 'Telč';
UPDATE distances SET travel_time_min = 190 WHERE end_city = 'Moravské Budějovice';
UPDATE distances SET travel_time_min = 162 WHERE end_city = 'Nové Město na Moravě';
UPDATE distances SET travel_time_min = 182 WHERE end_city = 'Náměšť nad Oslavou';
UPDATE distances SET travel_time_min = 138 WHERE end_city = 'Pacov';
UPDATE distances SET travel_time_min = 148 WHERE end_city = 'Počátky';
UPDATE distances SET travel_time_min = 120 WHERE end_city = 'Ledeč nad Sázavou';
UPDATE distances SET travel_time_min = 115 WHERE end_city = 'Golčův Jeníkov';

-- Jihomoravský kraj
UPDATE distances SET travel_time_min = 195 WHERE end_city = 'Znojmo';
UPDATE distances SET travel_time_min = 195 WHERE end_city = 'Břeclav';
UPDATE distances SET travel_time_min = 205 WHERE end_city = 'Hodonín';
UPDATE distances SET travel_time_min = 180 WHERE end_city = 'Vyškov';
UPDATE distances SET travel_time_min = 170 WHERE end_city = 'Blansko';
UPDATE distances SET travel_time_min = 178 WHERE end_city = 'Boskovice';
UPDATE distances SET travel_time_min = 175 WHERE end_city = 'Tišnov';
UPDATE distances SET travel_time_min = 175 WHERE end_city = 'Kuřim';
UPDATE distances SET travel_time_min = 185 WHERE end_city = 'Slavkov u Brna';
UPDATE distances SET travel_time_min = 185 WHERE end_city = 'Ivančice';
UPDATE distances SET travel_time_min = 190 WHERE end_city = 'Pohořelice';
UPDATE distances SET travel_time_min = 195 WHERE end_city = 'Hustopeče';
UPDATE distances SET travel_time_min = 210 WHERE end_city = 'Kyjov';
UPDATE distances SET travel_time_min = 215 WHERE end_city = 'Veselí nad Moravou';
UPDATE distances SET travel_time_min = 200 WHERE end_city = 'Mikulov';
UPDATE distances SET travel_time_min = 202 WHERE end_city = 'Valtice';
UPDATE distances SET travel_time_min = 200 WHERE end_city = 'Lednice';
UPDATE distances SET travel_time_min = 185 WHERE end_city = 'Židlochovice';
UPDATE distances SET travel_time_min = 180 WHERE end_city = 'Rosice';
UPDATE distances SET travel_time_min = 175 WHERE end_city = 'Letovice';
UPDATE distances SET travel_time_min = 220 WHERE end_city = 'Velká nad Veličkou';
UPDATE distances SET travel_time_min = 215 WHERE end_city = 'Strážnice';
UPDATE distances SET travel_time_min = 192 WHERE end_city = 'Bučovice';
UPDATE distances SET travel_time_min = 182 WHERE end_city = 'Oslavany';
UPDATE distances SET travel_time_min = 178 WHERE end_city = 'Modřice';

-- Olomoucký kraj
UPDATE distances SET travel_time_min = 188 WHERE end_city = 'Prostějov';
UPDATE distances SET travel_time_min = 200 WHERE end_city = 'Přerov';
UPDATE distances SET travel_time_min = 195 WHERE end_city = 'Šumperk';
UPDATE distances SET travel_time_min = 225 WHERE end_city = 'Jeseník';
UPDATE distances SET travel_time_min = 210 WHERE end_city = 'Hranice';
UPDATE distances SET travel_time_min = 188 WHERE end_city = 'Zábřeh';
UPDATE distances SET travel_time_min = 182 WHERE end_city = 'Mohelnice';
UPDATE distances SET travel_time_min = 195 WHERE end_city = 'Litovel';
UPDATE distances SET travel_time_min = 198 WHERE end_city = 'Šternberk';
UPDATE distances SET travel_time_min = 195 WHERE end_city = 'Uničov';
UPDATE distances SET travel_time_min = 202 WHERE end_city = 'Kojetín';
UPDATE distances SET travel_time_min = 210 WHERE end_city = 'Lipník nad Bečvou';
UPDATE distances SET travel_time_min = 238 WHERE end_city = 'Zlaté Hory';
UPDATE distances SET travel_time_min = 240 WHERE end_city = 'Javorník';
UPDATE distances SET travel_time_min = 205 WHERE end_city = 'Hanušovice';

-- Zlínský kraj
UPDATE distances SET travel_time_min = 210 WHERE end_city = 'Kroměříž';
UPDATE distances SET travel_time_min = 225 WHERE end_city = 'Uherské Hradiště';
UPDATE distances SET travel_time_min = 240 WHERE end_city = 'Vsetín';
UPDATE distances SET travel_time_min = 235 WHERE end_city = 'Uherský Brod';
UPDATE distances SET travel_time_min = 235 WHERE end_city = 'Valašské Meziříčí';
UPDATE distances SET travel_time_min = 245 WHERE end_city = 'Rožnov pod Radhoštěm';
UPDATE distances SET travel_time_min = 218 WHERE end_city = 'Holešov';
UPDATE distances SET travel_time_min = 218 WHERE end_city = 'Otrokovice';
UPDATE distances SET travel_time_min = 220 WHERE end_city = 'Napajedla';
UPDATE distances SET travel_time_min = 228 WHERE end_city = 'Staré Město';
UPDATE distances SET travel_time_min = 235 WHERE end_city = 'Luhačovice';
UPDATE distances SET travel_time_min = 228 WHERE end_city = 'Bystřice pod Hostýnem';
UPDATE distances SET travel_time_min = 232 WHERE end_city = 'Vizovice';
UPDATE distances SET travel_time_min = 240 WHERE end_city = 'Slavičín';
UPDATE distances SET travel_time_min = 245 WHERE end_city = 'Valašské Klobouky';
UPDATE distances SET travel_time_min = 250 WHERE end_city = 'Brumov-Bylnice';

-- Moravskoslezský kraj
UPDATE distances SET travel_time_min = 245 WHERE end_city = 'Opava';
UPDATE distances SET travel_time_min = 255 WHERE end_city = 'Karviná';
UPDATE distances SET travel_time_min = 250 WHERE end_city = 'Frýdek-Místek';
UPDATE distances SET travel_time_min = 235 WHERE end_city = 'Nový Jičín';
UPDATE distances SET travel_time_min = 240 WHERE end_city = 'Bruntál';
UPDATE distances SET travel_time_min = 252 WHERE end_city = 'Havířov';
UPDATE distances SET travel_time_min = 262 WHERE end_city = 'Třinec';
UPDATE distances SET travel_time_min = 255 WHERE end_city = 'Orlová';
UPDATE distances SET travel_time_min = 260 WHERE end_city = 'Český Těšín';
UPDATE distances SET travel_time_min = 238 WHERE end_city = 'Kopřivnice';
UPDATE distances SET travel_time_min = 250 WHERE end_city = 'Bohumín';
UPDATE distances SET travel_time_min = 248 WHERE end_city = 'Krnov';
UPDATE distances SET travel_time_min = 245 WHERE end_city = 'Hlučín';
UPDATE distances SET travel_time_min = 240 WHERE end_city = 'Bílovec';
UPDATE distances SET travel_time_min = 242 WHERE end_city = 'Studénka';
UPDATE distances SET travel_time_min = 245 WHERE end_city = 'Frenštát pod Radhoštěm';
UPDATE distances SET travel_time_min = 240 WHERE end_city = 'Příbor';
UPDATE distances SET travel_time_min = 235 WHERE end_city = 'Fulnek';
UPDATE distances SET travel_time_min = 235 WHERE end_city = 'Odry';
UPDATE distances SET travel_time_min = 240 WHERE end_city = 'Vítkov';
UPDATE distances SET travel_time_min = 242 WHERE end_city = 'Rýmařov';
UPDATE distances SET travel_time_min = 270 WHERE end_city = 'Jablunkov';
UPDATE distances SET travel_time_min = 250 WHERE end_city = 'Frýdlant nad Ostravicí';
UPDATE distances SET travel_time_min = 245 WHERE end_city = 'Vratimov';
UPDATE distances SET travel_time_min = 248 WHERE end_city = 'Šenov';
UPDATE distances SET travel_time_min = 252 WHERE end_city = 'Petřvald';

-- Praha a okolí
UPDATE distances SET travel_time_min = 60 WHERE end_city = 'Roztoky';
UPDATE distances SET travel_time_min = 68 WHERE end_city = 'Černošice';
UPDATE distances SET travel_time_min = 62 WHERE end_city = 'Hostivice';
UPDATE distances SET travel_time_min = 66 WHERE end_city = 'Rudná';
UPDATE distances SET travel_time_min = 60 WHERE end_city = 'Unhošť';
UPDATE distances SET travel_time_min = 55 WHERE end_city = 'Klecany';
UPDATE distances SET travel_time_min = 52 WHERE end_city = 'Odolena Voda';
UPDATE distances SET travel_time_min = 72 WHERE end_city = 'Úvaly';
UPDATE distances SET travel_time_min = 78 WHERE end_city = 'Jesenice';
UPDATE distances SET travel_time_min = 75 WHERE end_city = 'Průhonice';
UPDATE distances SET travel_time_min = 62 WHERE end_city = 'Čelákovice';
