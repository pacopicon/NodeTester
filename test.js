const sql_helper = require('./mssql_helper');

const getEmbeddedReportsRoleId = async (embeddedReportId, roleId) => {
  try {

    const 
      sp_query   = `EXEC get_EmbeddedReportInfo ${embeddedReportId} `,
      connection = await sql_helper.getConnection(),
      result     = await connection.request().query(sp_query),
      embRepInfo = result.recordset[0]

    console.log('embRepInfo = ', embRepInfo)

    if (embRepInfo.IsEnabled == '0' || embRepInfo.IsEnabled == 0) {
      connection.close();
      console.log('embRepInfo.IsEnabled = ', embRepInfo.IsEnabled)
      // callback(null, false)
    } else {
      const 
        sp_query    = `EXEC get_EmbeddedReportRoles ${embRepInfo.id} `,
        connection  = await sql_helper.getConnection(),
        result      = await connection.request().query(sp_query),
        objArr      = result.recordset,
        roleSet     = new Set()
      
      connection.close();

      for (let i=0; i<objArr.length; i++) {
        roleSet.add(objArr[i].RoleID)
      }
      let bool = roleSet.has(roleId)
      console.log('objArr = ', objArr)
      console.log('roleSet = ', roleSet)
      console.log('bool = ', bool)
      // callback(null, bool)
      process.exit()
    }
  }
  catch(err) {
    console.log('err = ', err)
		// callback(err, null);
  }
}

getEmbeddedReportsRoleId(process.argv[2],process.argv[3])