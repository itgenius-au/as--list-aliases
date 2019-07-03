function onOpen(e) {
    var subMenu = [{name:"Run Script", functionName: "listAlias"}];
    SpreadsheetApp.getActiveSpreadsheet().addMenu("Get User Aliases", subMenu);
  }
  
function listAlias() {
    
  var result = ui.prompt(
    'List User Aliases',
    'Enter sheet name (where the list will be populated):',
    ui.ButtonSet.OK_CANCEL);
  
    var page, pageToken,
        users = [],
        values = [];
  
    var sheetName = result.getResponseText();
    
    // List all users
    do {
      page = AdminDirectory.Users.list({
        maxResults: 500,
        pageToken: pageToken,
        customer : "my_customer"
      });
      users = users.concat(page.users); // combine all users from each page
      pageToken = page.nextPageToken;
    } while(pageToken); // End of do-while
    
    // List all aliases
    for each(var user in users){
        var als = AdminDirectory.Users.Aliases.list(user.primaryEmail);
      for each (var al in als.aliases){
        var row = [ al.primaryEmail, al.alias ];
        values.push(row);
      }
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    ss.getRange("A2:Z").clear;
    ss.getRange(2, 1, values.length, values[0].length).setValues(values);
    
}
  