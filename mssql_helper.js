const sql = require('mssql');

require('dotenv').config();

var config = {
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  server: process.env.RDS_HOSTNAME, // You can use 'localhost\\instance' to connect to named instance
  database: process.env.MSSQL_DATABASE,

  options: {
      encrypt: false // Use this if you're on Windows Azure
  }
}

exports.getQueryResult = async function(query) {
  try {
    const connection = await this.getConnection();
    const result = await connection.request().query(query);
    connection.close();

    if(result.recordsets[0].length > 0){
      return result.recordsets[0];
    } else {
      return null;
    }  
  }
  catch(err) {
    console.log(err);
    return null;
  }
}

exports.getLastIdentityQuery = function(query, tableName) {
   query += `; SELECT IDENT_CURRENT('` + tableName + `') AS 'Identity';`

   return query
}

exports.getConnection = async function() {
  var connection = new sql.ConnectionPool(config);

  try {
    var newPool = await connection.connect();
    return newPool;
  } catch (err) {
    return null;
  }
}

exports.createTransaction = async function(query, callback) {
  var newPool = await this.getConnection();
  const transaction = new sql.Transaction(newPool);

  // console.log(query);

  transaction.begin(err => {
    if(err){
      return callback(err, false);
    }
    
    let rolledBack = false;

    transaction.on('rollback', aborted => {
      // emited with aborted === true
      rolledBack = true;
    });

    new sql.Request(transaction).query(query, (err, result) => {
      if (err) {
        if (!rolledBack) {
          transaction.rollback(rbErr => {
            return callback(rbErr||err, false);
          });
        }
      } else {
        transaction.commit(err => {
          var changesApplied = result.rowsAffected[0] > 0;
          var recordset = result.recordset;
          var identity = null;
          if(recordset != null) {
            identity = recordset[0].Identity
          }

          return callback(err, changesApplied, identity);
        });
      }
    });
  });
}