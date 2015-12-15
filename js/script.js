var india_result=[];
var africa_result=[];
var continent_result=[];
var continent_data=[];
var headers=[];
var country_name="";
var indicator="";
var k=0;
var year2010="";
var fs=require("fs");
var readline = require('readline');

var rl = readline.createInterface({
  input: fs.createReadStream("WDI_Data.csv")
});
var c = fs.readFileSync('../json/countries.json');
country = JSON.parse(c);
c = fs.readFileSync('../json/continents.json');
continents = JSON.parse(c);


rl.on('line',function(line){
  var data=line.split(",");
  if(headers=='')
  {
    k=0;
    for(i=0;i<data.length;i++){
    headers.push(data[i]);
    }
    for(j=0;j<headers.length;j++){
      if(headers[j].indexOf("Country Name")==0){
        country_name=j;
        console.log(country_name);
      }
      if(headers[j].indexOf("Indicator Name")==0){
        indicator=j;
        console.log(indicator);
      }
      if(headers[j].indexOf("2010")==0){
        year2010=j;
        console.log(year2010);
      }
      if(isNaN(parseFloat(headers[j]))){
        k++;
      }
    }

  }

  else if(data[country_name]==="India"){
    if((data[indicator]==="Arable land (% of land area)")||(data[indicator]==="Arable land (hectares per person)")||(data[indicator]==="Arable land (hectares)")){

    india_result.push(data);}
  }
for(i=0;i<country.length;i++){
  if((data[country_name].indexOf(country[i])>=0)&&(continents[country[i]]=="AFRICA")&&(data[indicator]=="Arable land (% of land area)")){
    africa_result.push(data);
  }
  if((data[country_name].indexOf(country[i])>=0)&&(data[indicator]=="Arable land (hectares)")){
    continent_data.push(data);
  }
}
//  console.log(india_result);
});

rl.on('close',function(){

  arable=[];
  arable_obj={};
  for(j=k;j<headers.length;j++){
    arable_obj=new Object();
    arable_obj["year"]=headers[j];
    arable_obj["land"]=0;
    arable_obj["person"]=0;
    arable_obj["hectares"]=0;
    arable.push(arable_obj);
  }
  n=k;
  for(i in india_result)  {
//console.log(india_result[i]);
    if(india_result[i][indicator]==="Arable land (% of land area)"){
        m=0;
      for(j=n;j<headers.length;j++){
//        console.log(arable[m]["land"]);
        arable[m]["land"]=parseFloat(india_result[i][j]);
        m++;
      }
    }
    if(india_result[i][indicator]==="Arable land (hectares per person)"){
        m=0;
      for(j=n;j<headers.length;j++){
        arable[m]["person"]=parseFloat(india_result[i][j]);
        m++;
      }
    }
    if(india_result[i][indicator]==="Arable land (hectares)"){
        m=0;
      for(j=n;j<headers.length;j++){
        arable[m]["hectares"]=parseFloat(india_result[i][j]);
        m++;
      }
    }
  }
   africa=[];

  for(i in africa_result)
  {
    africa_obj={};
    africa_obj["country"]=africa_result[i][country_name];
    africa_obj["y2010"]=parseFloat(africa_result[i][year2010]);
    africa.push(africa_obj);
  }
obj={};
  for(j=k;j<headers.length;j++){
    obj=new Object();
    obj["year"]=headers[j];
    obj["ASIA"]=0;
    obj["AFRICA"]=0;
    obj["EUROPE"]=0;
    obj["N_AMERICA"]=0;
    obj["S_AMERICA"]=0;
    obj["OCEANIA"]=0;
    continent_result.push(obj);
  }

  for(i in continent_data){

    for(j=4;j<headers.length;j++){
      if(continent_data[i][j]==''){
        continent_data[i][j]=0;
      }
      continent_result[j-4][continents[continent_data[i][country_name]]]+=parseFloat(continent_data[i][j]);
    }
   }
   var jsonOne = JSON.stringify(arable,null,4);
  fs.writeFile('../json/reqOne1.json',jsonOne,function(err){
    if(err){
      console.error(err);
    }})
  var jsonTwo = JSON.stringify(africa,null,4);
  fs.writeFile('../json/req2.json',jsonTwo,function(err){
    if(err){
      console.error(err);
      }})
  var jsonThree = JSON.stringify(continent_result,null,4);
  fs.writeFile('../json/req3.json',jsonThree,function(err){
    if(err){
      console.error(err);
      }})
});
