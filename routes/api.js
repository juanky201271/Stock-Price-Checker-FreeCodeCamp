/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var Request = require("request");

module.exports = function (app, db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      var stock = req.query.stock;
      var like = req.query.like;
      if (!Array.isArray(stock)) {
        stock = [stock.toUpperCase()]
      } else {
        stock = [stock[0].toUpperCase(), stock[1].toUpperCase()]
      }
      console.log(stock);
      console.log(like);
      var latestPrice = [null,null];
      var likes = [null,null];
      var j = '';
    
      if (stock.length >= 1) {
        Request.get("https://repeated-alpaca.glitch.me/v1/stock/" + stock[0] + "/quote", (error, response, body) => {
            if(error) {
                return console.log(error);
            } else {
              latestPrice[0] = (String(body) == '"Unknown symbol"' || String(body) == '"Invalid symbol"' ? null : JSON.parse(body).latestPrice);
              console.log(String(body));
              console.log(latestPrice);
              console.log(req.ip);
              if (latestPrice[0] === null) {
                res.json('Stock not found');
              } else {
              
                if (like) {
                  // pulsando like
                  var jb0 = {stock: stock[0], ip: req.ip};
                  db.collection('likes').find(jb0).toArray((err, doc) => {
                    console.log(err);
                    console.log(doc);
                      if(err) {
                        res.json('could not find stock and ip');
                      } else if (doc.length === 0) {
                        // no existe 
                        db.collection('likes').insertOne({stock: stock[0], ip: req.ip}, (err, doc2) => {
                              if(err) {
                                  res.json('could not add like');
                              } else {
                                db.collection('likes').find({stock: stock[0]}).toArray((err, doc3) => {
                                    if(err) {
                                      res.json('could not find likes');
                                    } else {
                                      likes[0] = doc3.length;

                                      if (stock.length > 1) {
                                        Request.get("https://repeated-alpaca.glitch.me/v1/stock/" + stock[1] + "/quote", (error2, response2, body2) => {
                                            if(error) {
                                                return console.log(error2);
                                            } else {
                                              latestPrice[1] = (String(body2) == '"Unknown symbol"' || String(body2) == '"Invalid symbol"'  ? null : JSON.parse(body2).latestPrice);
                                              console.log(String(body2));
                                              console.log(latestPrice);
                                              console.log(req.ip);
                                              if (latestPrice[1] === null) {
                                                res.json('Stock not found');
                                              } else {
                                                
                                                  db.collection('likes').find({stock: stock[1], ip: req.ip}).toArray((err, doc4) => {
                                                      if(err) {
                                                        res.json('could not find stock and ip');
                                                      } else if (doc4.length === 0) {
                                                        // no existe
                                                        db.collection('likes').insertOne({stock: stock[1], ip: req.ip}, (err, doc5) => {
                                                              if(err) {
                                                                  res.json('could not add like');
                                                              } else {
                                                                db.collection('likes').find({stock: stock[1]}).toArray((err, doc6) => {
                                                                    if(err) {
                                                                      res.json('could not find likes');
                                                                    } else {
                                                                      likes[1] = doc6.length;
                                                                      j = '{"stockData":[{"stock":"' + stock[0] + '","price":"' + latestPrice[0] + '","rel_likes":' + (likes[0] - likes[1]) + 
                                                                                      '},{"stock":"' + stock[1] + '","price":"' + latestPrice[1] + '","rel_likes":' + (likes[1] - likes[0]) + '}]}';
                                                                      res.json(JSON.parse(j));
                                                                    }
                                                                });
                                                              }
                                                          }
                                                        );
                                                      } else {
                                                        // si existe
                                                        
                                                        db.collection('likes').find({stock: stock[1]}).toArray((err, doc6) => {
                                                            if(err) {
                                                              res.json('could not find likes');
                                                            } else {
                                                              likes[1] = doc6.length;
                                                              j = '{"stockData":[{"stock":"' + stock[0] + '","price":"' + latestPrice[0] + '","rel_likes":' + (likes[0] - likes[1]) + 
                                                                              '},{"stock":"' + stock[1] + '","price":"' + latestPrice[1] + '","rel_likes":' + (likes[1] - likes[0]) + '}]}';
                                                              res.json(JSON.parse(j));
                                                            }
                                                        });
                                                        
                                                      }
                                                  });
        
                                              }
                                            }
                                        });
                                      } else {
                                        j = '{"stockData":{"stock":"' + stock[0] + '","price":"' + latestPrice[0] + '","likes":' + likes[0] + '}}';
                                        res.json(JSON.parse(j));
                                      }

                                    }
                                });
                              }
                          }
                        );
                      } else {
                        // si existe
                        
                        db.collection('likes').find({stock: stock[0]}).toArray((err, doc3) => {
                          if(err) {
                            res.json('could not find likes');
                          } else {
                            likes[0] = doc3.length;

                            if (stock.length > 1) {
                              Request.get("https://repeated-alpaca.glitch.me/v1/stock/" + stock[1] + "/quote", (error2, response2, body2) => {
                                  if(error) {
                                      return console.log(error2);
                                  } else {
                                    latestPrice[1] = (String(body2) == '"Unknown symbol"' || String(body2) == '"Invalid symbol"'  ? null : JSON.parse(body2).latestPrice);
                                    console.log(String(body2));
                                    console.log(latestPrice);
                                    console.log(req.ip);
                                    if (latestPrice[1] === null) {
                                      res.json('Stock not found');
                                    } else {

                                        db.collection('likes').find({stock: stock[1], ip: req.ip}).toArray((err, doc4) => {
                                            if(err) {
                                              res.json('could not find stock and ip');
                                            } else if (doc4.length === 0) {
                                              // no existe
                                              db.collection('likes').insertOne({stock: stock[1], ip: req.ip}, (err, doc5) => {
                                                    if(err) {
                                                        res.json('could not add like');
                                                    } else {
                                                      db.collection('likes').find({stock: stock[1]}).toArray((err, doc6) => {
                                                          if(err) {
                                                            res.json('could not find likes');
                                                          } else {
                                                            likes[1] = doc6.length;




                                                            j = '{"stockData":[{"stock":"' + stock[0] + '","price":"' + latestPrice[0] + '","rel_likes":' + (likes[0] - likes[1]) + 
                                                                            '},{"stock":"' + stock[1] + '","price":"' + latestPrice[1] + '","rel_likes":' + (likes[1] - likes[0]) + '}]}';
                                                            res.json(JSON.parse(j));



                                                          }
                                                      });
                                                    }
                                                }
                                              );
                                            } else {
                                              // si existe

                                              db.collection('likes').find({stock: stock[1]}).toArray((err, doc6) => {
                                                  if(err) {
                                                    res.json('could not find likes');
                                                  } else {
                                                    likes[1] = doc6.length;
                                                    j = '{"stockData":[{"stock":"' + stock[0] + '","price":"' + latestPrice[0] + '","rel_likes":' + (likes[0] - likes[1]) + 
                                                                    '},{"stock":"' + stock[1] + '","price":"' + latestPrice[1] + '","rel_likes":' + (likes[1] - likes[0]) + '}]}';
                                                    res.json(JSON.parse(j));
                                                  }
                                              });
                                              
                                            }
                                        });
                                      
                                    }
                                  }
                              });
                            } else {
                              j = '{"stockData":{"stock":"' + stock[0] + '","price":"' + latestPrice[0] + '","likes":' + likes[0] + '}}';
                              res.json(JSON.parse(j));
                            }

                          }
                      });
                        
                      }
                  });
                } else {
                  // sin pulsar like

                  db.collection('likes').find({stock: stock[0]}).toArray((err, doc3) => {
                    if(err) {
                      res.json('could not find likes');
                    } else {
                      likes[0] = doc3.length;

                      if (stock.length > 1) {
                        Request.get("https://repeated-alpaca.glitch.me/v1/stock/" + stock[1] + "/quote", (error3, response3, body3) => {
                            if(error) {
                                return console.log(error3);
                            } else {
                              latestPrice[1] = (String(body3) == '"Unknown symbol"' || String(body3) == '"Invalid symbol"'  ? null : JSON.parse(body3).latestPrice);
                              console.log(String(body3));
                              console.log(latestPrice);
                              console.log(req.ip);

                              if (latestPrice[1] === null) {
                                res.json('Stock not found');
                              } else {
            
                                db.collection('likes').find({stock: stock[1]}).toArray((err, doc6) => {
                                    if(err) {
                                      res.json('could not find likes');
                                    } else {
                                      likes[1] = doc6.length;
                                      j = '{"stockData":[{"stock":"' + stock[0] + '","price":"' + latestPrice[0] + '","rel_likes":' + (likes[0] - likes[1]) + 
                                                      '},{"stock":"' + stock[1] + '","price":"' + latestPrice[1] + '","rel_likes":' + (likes[1] - likes[0]) + '}]}';
                                      res.json(JSON.parse(j));
                                    }
                                });
                                              
                              }

                            }
                        });
                      } else {
                        j = '{"stockData":{"stock":"' + stock[0] + '","price":"' + latestPrice[0] + '","likes":' + likes[0] + '}}';
                        res.json(JSON.parse(j));
                      }

                    }
                });

                }
              }
              
            }
        });
            
      }

      
    });
    
};
