if (app.name === "ExtendScript Toolkit") { 
    app.clc(); 
  }
  else {
    var estApp= BridgeTalk.getSpecifier("estoolkit");
    if(estApp) {
      var bt = new BridgeTalk;
      bt.target = estApp;
      bt.body = "app.clc()";
      bt.send();
    }
  }