#target photoshop

var fileOut = new File(
  "D:/io.graphics/render2app/recipes/_exchange/PhotoshopBusy.ini"
);
fileOut.encoding = "UTF8";
fileOut.open("w");
fileOut.write("false");
fileOut.close();
