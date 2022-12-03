function print(text) {
    $.writeln(text)
}

function close_all () {
    while (documents.length) {
        activeDocument.close(SaveOptions.DONOTSAVECHANGES)
    }
}

function close(activeDocument) {
    activeDocument.close(SaveOptions.DONOTSAVECHANGES)
}

function folder_init (folder) {
    if (folder.exists == false) {
        folder.create()
    }
}

// =======================================================
// PIPELINE SPECIFIC FUNCTIONS
function replaceInString (string, regexp, replace_string) {
    while (RegExp(regexp).exec(string)) {
        string = string.replace(regexp, replace_string)
    }
    return string
}

function indexOfArrayElement (array, string) {
    for (i in array) {
        if (string == array[i]) {
            idx = i
            break;
        }
        else {
            idx = null
        }
    }
    
    return idx
}

// Совпадает ли string с каким-либо элементом массива?
function check_if_string_matches_any_element_of_array ( string, array ) {
    var result = false;
    for (var i in array) {
        if (string == array[i]) {
            result = true;
        }
    }
    return result;
}

function check_if_exists_in_array ( array, string ) {
    var result = false;
    for (var i in array) {
        if (string.toLowerCase() == array[i].toLowerCase()) {
            result = true;
        }
    }
    return result;
}

// (> не очень умная функция <)
function check_pose_grp_exists(item) {
    if (item.poses.length > 0) {
        for (var p_i=0; p_i < item.poses.length; p_i++){
            if (item.poses[p_i].pose_grps.length > 0) {
                return true;
                break;
            }
        }
    }
    else {
        return false;
    }
}

// (> не очень умная функция <)
function identify_hashtag (input_string) {
    print ('returns #material or pass name like A_Beauty')
}

function regex_build_from_array (array) {
    regex_string = ''
    for (i in array) {
        mat = array[i]
        regex_string = regex_string + '(?:' + mat + ')'
        if (i < array.length-1) {
            regex_string = regex_string + '|' 
        }
    }
    return new RegExp(regex_string, 'gm') 
}


// =======================================================
// E X P O R T  and  S A V I N G
function save_as_png (path, name) {

    var opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false;
    opts.quality = 100;

    folder_init(path)

    // name cleanup (off)
    // name = replaceInString (name, ' ', '_')
    // name = replaceInString (name, '%', 'pct')

    var file = new File (path + '/' + name + '.png')
   
    activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts)

}

function save_as_jpg (path, name, quality) {
    var opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.JPEG;
    opts.quality = quality;

    folder_init(path)

    // name cleanup (off)
    // name = replaceInString (name, ' ', '_')
    // name = replaceInString (name, '%', 'pct')

    var file = new File (path + '/' + name+'.jpg')

    activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts)

}


// =======================================================
// =======================================================
// =======================================================
// L A Y E R S  &  G R O U P S  manipulation
function findLayerByName(parent, searchWord) {
    print (searchWord)
    function findLayer_exec(parent, searchWord, foundLayers) {
        var layers = parent.layers;
        var searchWord = new RegExp(searchWord.toString().toLowerCase());

            
        for (var layer_i=0; layer_i < layers.length; layer_i++) {
            
            var layer = layers[layer_i];        
            
           
            // если layer , если Name lowercase совпадает с поиском , то return найденный layer
            if (layer.typename == 'ArtLayer') {
                
                if (searchWord.exec(layer.name.toLowerCase())) {
                    //print ('found');
                    foundLayers.push(layer)
                    
                    return foundLayers;
                };
            
            } //. end of if-statement (поиск слоя)
        
            // если layerSet : то идем ниже, запускаем функцию рекурс
            else if (layer.typename == 'LayerSet') {
                findLayer_exec(layer, searchWord, foundLayers);
            }
                
        
        } //. end of for loop
        
        return foundLayers;

    } //. end of function findLayer
    
    
    
    
   
    return findLayer_exec(parent, searchWord, [])[0]

}


// sdasd
function findGroupByName(parent, searchWord) {
    function findLayer_exec(parent, searchWord, foundLayers) {
        var layers = parent.layers;
        var searchWord = new RegExp(searchWord.toString().toLowerCase());

            
        for (var layer_i=0; layer_i < layers.length; layer_i++) {
            
            var layer = layers[layer_i];        
            
           
            // если layer , если Name lowercase совпадает с поиском , то return найденный layer
            if (layer.typename == 'LayerSet') {
                
                if (searchWord.exec(layer.name.toLowerCase())) {
                    //print ('found');
                    foundLayers.push(layer)
                    
                    return foundLayers;
                };
            
            } //. end of if-statement (поиск слоя)
        
            // если layerSet : то идем ниже, запускаем функцию рекурс
            else if (layer.typename == 'LayerSet') {
                findLayer_exec(layer, searchWord, foundLayers);
            }
                
        
        } //. end of for loop
        
        return foundLayers;

    } //. end of function findLayer
    
    
    
    
   
    return findLayer_exec(parent, searchWord, [])[0]

}

function removeListOfObjects(list) {
    for (var i = 0; i < list.length; i++) {
       list[i].remove()
    }
}

function visibleList(list, onOff) {
    for (var i = 0; i < list.length; i++) {
        list[i].visible = onOff
    }
}

function removeList(list) {
    for (var i = 0; i < list.length; i++) {
        try {
            list[i].remove()
        }
        catch (e) {
            print ('>>> removeList() error :')
            print (e)
            print ()
        }
    }
}

function createNewLayer (layername, below) {
    if (layername == undefined) layername = "Layer";

    // create new layer at top of layers
    var layer_main = activeDocument.activeLayer;
    var layer_new = activeDocument.artLayers.add();

    // name it and set blendMode to normal
    layer_new.name = layername;
    layer_new.blendMode = BlendMode.NORMAL;

    // Move the layer below
    if (below) {
        layer_new.moveAfter(layer_main);
    }

    if (!below) {
        layer_new.moveBefore(layer_main);
    }
}

function createSolidColorLayer (r,g,b, name) {
    if (name == null) {
        name = "Solid"
    }
    
    var idMk = charIDToTypeID( "Mk  " );
        var desc864 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref60 = new ActionReference();
            var idcontentLayer = stringIDToTypeID( "contentLayer" );
            ref60.putClass( idcontentLayer );
        desc864.putReference( idnull, ref60 );
        var idUsng = charIDToTypeID( "Usng" );
            var desc865 = new ActionDescriptor();
            var idNm = charIDToTypeID( "Nm  " );
            desc865.putString( idNm, name );
            var idType = charIDToTypeID( "Type" );
                var desc866 = new ActionDescriptor();
                var idClr = charIDToTypeID( "Clr " );
                    var desc867 = new ActionDescriptor();
                    var idRd = charIDToTypeID( "Rd  " );
                    desc867.putDouble( idRd, r );
                    var idGrn = charIDToTypeID( "Grn " );
                    desc867.putDouble( idGrn, g );
                    var idBl = charIDToTypeID( "Bl  " );
                    desc867.putDouble( idBl, b );
                var idRGBC = charIDToTypeID( "RGBC" );
                desc866.putObject( idClr, idRGBC, desc867 );
            var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
            desc865.putObject( idType, idsolidColorLayer, desc866 );
        var idcontentLayer = stringIDToTypeID( "contentLayer" );
        desc864.putObject( idUsng, idcontentLayer, desc865 );
    executeAction( idMk, desc864, DialogModes.NO );

    return activeDocument.activeLayer
}



// ===============================================================
// COLOR CORRECTION

function makeCurves(p1_in, p1_out, p2_in, p2_out) {
    var c_ADJ_LAYER = charIDToTypeID( "AdjL" );
    var c_ADJUSTMENT = charIDToTypeID( "Adjs" );
    var c_CHANNEL = charIDToTypeID( "Chnl" );
    var c_COMPOSITE = charIDToTypeID( "Cmps" );
    var c_CURVE = charIDToTypeID( "Crv " );
    var c_CURVE_A = charIDToTypeID( "CrvA" );
    var c_CURVES = charIDToTypeID( "Crvs" );
    var c_HORIZONTAL = charIDToTypeID( "Hrzn" );
    var c_MAKE = charIDToTypeID( "Mk  " );
    var c_NULL = charIDToTypeID( "null" );
    var c_POINT = charIDToTypeID( "Pnt " );
    var c_TYPE = charIDToTypeID( "Type" );
    var c_USING = charIDToTypeID( "Usng" );
    var c_VERTICAL = charIDToTypeID( "Vrtc" );

							
		var d_CURVES_LAYER = new ActionDescriptor();
		// Contains all the information necessary to perform the "MAKE" action
			var r_CLASS = new ActionReference();
			r_CLASS.putClass( c_ADJ_LAYER );
		d_CURVES_LAYER.putReference( c_NULL, r_CLASS );
		// Class of make action is of an ajdustment layer
			var d_TYPE_CURVES = new ActionDescriptor();
			// Contains all the information about all the curves
				var d_CHANNEL_CURVES = new ActionDescriptor();
					var l_CHANNEL_CURVES = new ActionList();
					// Contains a list of channel curves
						var d_CHANNEL_CURVE = new ActionDescriptor();
						// Information for 1 channel curve
							var r_CHANNEL = new ActionReference();
							r_CHANNEL.putEnumerated( c_CHANNEL, c_CHANNEL, c_COMPOSITE );
							// This curve is for the composite channel - VARIES
						d_CHANNEL_CURVE.putReference( c_CHANNEL, r_CHANNEL );
						// Contains the point list
							var l_POINTS = new ActionList();
							// List of points for this channel - LENGTH VARIES
								var d_POINT = new ActionDescriptor();
								// One point on the curve, has INPUT and OUTPUT value
								d_POINT.putDouble( c_HORIZONTAL, 0.000000 );
								d_POINT.putDouble( c_VERTICAL, 0.000000 );
							l_POINTS.putObject( c_POINT, d_POINT );
								//var d_POINT2 = new ActionDescriptor();
								d_POINT.putDouble( c_HORIZONTAL, p1_in );
								d_POINT.putDouble( c_VERTICAL, p1_out );
							l_POINTS.putObject( c_POINT, d_POINT );
								//var d_POINT2 = new ActionDescriptor();
								d_POINT.putDouble( c_HORIZONTAL, p2_in );
								d_POINT.putDouble( c_VERTICAL, p2_out );
							l_POINTS.putObject( c_POINT, d_POINT );
								//var d_POINT3 = new ActionDescriptor();
								d_POINT.putDouble( c_HORIZONTAL, 255.000000 );
								d_POINT.putDouble( c_VERTICAL, 255.000000 );
							l_POINTS.putObject( c_POINT, d_POINT );
							// Made the list of points
						d_CHANNEL_CURVE.putList( c_CURVE, l_POINTS );
						// Now have a list of points for a specific channel
					l_CHANNEL_CURVES.putObject( c_CURVE_A, d_CHANNEL_CURVE );
					// Add to the list of channel curves
				d_CHANNEL_CURVES.putList( c_ADJUSTMENT, l_CHANNEL_CURVES );
				// All the channel curves are inside here
			d_TYPE_CURVES.putObject( c_TYPE, c_CURVES, d_CHANNEL_CURVES );
			// .....
		d_CURVES_LAYER.putObject( c_USING, c_ADJ_LAYER, d_TYPE_CURVES );
		// package the curves and definition of the adjustment layer type
	executeAction( c_MAKE, d_CURVES_LAYER, DialogModes.NO );
}

function applyHsl( hue, saturation, lightness ) {
    var HUE_SAT_ADJUSTMENT_V2_SYM  = 'Hst2';
    var COLORIZE_SYM               = 'Clrz';
    var ADJUSTMENT_SYM             = 'Adjs';
    var HUE_SYM                    = 'H   ';
    var SATURATION_SYM             = 'Strt';
    var LIGHTNESS_SYM              = 'Lght';
    var HUE_SATURATION_SYM         = 'HStr';

    var colorizeDescriptor = new ActionDescriptor();
    var hueSatDescriptor = new ActionDescriptor();
    var hueSatAdjustmentList = new ActionList();

    colorizeDescriptor.putBoolean( charIDToTypeID( COLORIZE_SYM ), false );

    hueSatDescriptor.putInteger( charIDToTypeID( HUE_SYM ), hue );
    hueSatDescriptor.putInteger( charIDToTypeID( SATURATION_SYM ), saturation );
    hueSatDescriptor.putInteger( charIDToTypeID( LIGHTNESS_SYM ), lightness );

    hueSatAdjustmentList.putObject( charIDToTypeID( HUE_SAT_ADJUSTMENT_V2_SYM ), hueSatDescriptor );
    colorizeDescriptor.putList( charIDToTypeID( ADJUSTMENT_SYM ), hueSatAdjustmentList );

    executeAction(
        charIDToTypeID( HUE_SATURATION_SYM ),
        colorizeDescriptor,
        DialogModes.NO
    );
}

function desaturate_сolor (layer) {
    var new_layer = layer.duplicate()
    new_layer.blendMode = BlendMode.SATURATION
    activeDocument.activeLayer = new_layer
    new_layer.desaturate()


    new_layer.merge()
    return new_layer
}

function reduce_noise (strength, preserveDetails, reduceColorNoise, sharpenDetails) {
    if (reduceColorNoise == null) {
        reduceColorNoise = 0.000000
    }
    else {
        reduceColorNoise = reduceColorNoise
    }
    if (sharpenDetails == null) {
        sharpenDetails = 0.000000
    }
    else {
        sharpenDetails = sharpenDetails
    }
    var iddenoise = stringIDToTypeID( "denoise" );
    var desc14671 = new ActionDescriptor();
    var idClNs = charIDToTypeID( "ClNs" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc14671.putUnitDouble( idClNs, idPrc, reduceColorNoise );
    var idShrp = charIDToTypeID( "Shrp" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc14671.putUnitDouble( idShrp, idPrc, sharpenDetails );
    var idremoveJPEGArtifact = stringIDToTypeID( "removeJPEGArtifact" );
    desc14671.putBoolean( idremoveJPEGArtifact, false );
    var idchannelDenoise = stringIDToTypeID( "channelDenoise" );
    var list971 = new ActionList();
    var desc14672 = new ActionDescriptor();
    var idChnl = charIDToTypeID( "Chnl" );
    var ref1323 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idChnl = charIDToTypeID( "Chnl" );
    var idCmps = charIDToTypeID( "Cmps" );
    ref1323.putEnumerated( idChnl, idChnl, idCmps );
    desc14672.putReference( idChnl, ref1323 );
    var idAmnt = charIDToTypeID( "Amnt" );
    desc14672.putInteger( idAmnt, strength );
    var idEdgF = charIDToTypeID( "EdgF" );
    desc14672.putInteger( idEdgF, preserveDetails );
    var idchannelDenoiseParams = stringIDToTypeID( "channelDenoiseParams" );
    list971.putObject( idchannelDenoiseParams, desc14672 );
    var desc14673 = new ActionDescriptor();
    var idChnl = charIDToTypeID( "Chnl" );
    var ref1324 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idChnl = charIDToTypeID( "Chnl" );
    var idRd = charIDToTypeID( "Rd  " );
    ref1324.putEnumerated( idChnl, idChnl, idRd );
    desc14673.putReference( idChnl, ref1324 );
    var idAmnt = charIDToTypeID( "Amnt" );
    desc14673.putInteger( idAmnt, 0 );
    var idchannelDenoiseParams = stringIDToTypeID( "channelDenoiseParams" );
    list971.putObject( idchannelDenoiseParams, desc14673 );
    var desc14674 = new ActionDescriptor();
    var idChnl = charIDToTypeID( "Chnl" );
    var ref1325 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idChnl = charIDToTypeID( "Chnl" );
    var idGrn = charIDToTypeID( "Grn " );
    ref1325.putEnumerated( idChnl, idChnl, idGrn );
    desc14674.putReference( idChnl, ref1325 );
    var idAmnt = charIDToTypeID( "Amnt" );
    desc14674.putInteger( idAmnt, 0 );
    var idchannelDenoiseParams = stringIDToTypeID( "channelDenoiseParams" );
    list971.putObject( idchannelDenoiseParams, desc14674 );
    var desc14675 = new ActionDescriptor();
    var idChnl = charIDToTypeID( "Chnl" );
    var ref1326 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idChnl = charIDToTypeID( "Chnl" );
    var idBl = charIDToTypeID( "Bl  " );
    ref1326.putEnumerated( idChnl, idChnl, idBl );
    desc14675.putReference( idChnl, ref1326 );
    var idAmnt = charIDToTypeID( "Amnt" );
    desc14675.putInteger( idAmnt, 0 );
    var idchannelDenoiseParams = stringIDToTypeID( "channelDenoiseParams" );
    list971.putObject( idchannelDenoiseParams, desc14675 );
    desc14671.putList( idchannelDenoise, list971 );
    var idpreset = stringIDToTypeID( "preset" );
    desc14671.putString( idpreset, """Default""" );
    executeAction( iddenoise, desc14671, DialogModes.NO );

}

// runs Action on current activeLayer
function run_action (action_set, action_name) {
    var idPly = charIDToTypeID( "Ply " );
    var desc14643 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref1308 = new ActionReference();
    var idActn = charIDToTypeID( "Actn" );
    ref1308.putName( idActn, action_name );
    var idASet = charIDToTypeID( "ASet" );
    ref1308.putName( idASet, action_set );
    desc14643.putReference( idnull, ref1308 );
    executeAction( idPly, desc14643, DialogModes.NO );
}

// ==================================================================
// M A S K S

function selectMask(LayerName) {
  try
  {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Msk ') );
    ref.putName( charIDToTypeID('Lyr '), LayerName );
    desc.putReference( charIDToTypeID('null'), ref );
    desc.putBoolean( charIDToTypeID('MkVs'), true );
    executeAction( charIDToTypeID('slct'), desc, DialogModes.NO );

    // =======================================================
    var id1083 = charIDToTypeID( "setd" );
    var desc238 = new ActionDescriptor();
    var id1084 = charIDToTypeID( "null" );
    var ref161 = new ActionReference();
    var id1085 = charIDToTypeID( "Chnl" );
    var id1086 = charIDToTypeID( "fsel" );
    ref161.putProperty( id1085, id1086 );
    desc238.putReference( id1084, ref161 );
    var id1087 = charIDToTypeID( "T   " );
    var ref162 = new ActionReference();
    var id1088 = charIDToTypeID( "Chnl" );
    var id1089 = charIDToTypeID( "Ordn" );
    var id1090 = charIDToTypeID( "Trgt" );
    ref162.putEnumerated( id1088, id1089, id1090 );
    desc238.putReference( id1087, ref162 );
    executeAction( id1083, desc238, DialogModes.NO );
  }
  catch(e)
  {
    //alert( "This layer has NO layer mask!" );
    activeDocument.selection.deselect();
  }
}

function select_mask () {
    // =======================================================
    var idslct = charIDToTypeID( "slct" );
        var desc112 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref57 = new ActionReference();
            var idChnl = charIDToTypeID( "Chnl" );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref57.putEnumerated( idChnl, idOrdn, idTrgt );
        desc112.putReference( idnull, ref57 );
        var idMkVs = charIDToTypeID( "MkVs" );
        desc112.putBoolean( idMkVs, true );
    executeAction( idslct, desc112, DialogModes.NO );




}

function loadLayerSelection() {
    var c2t = function (s) {
        return app.charIDToTypeID(s);
    };

    var s2t = function (s) {
        return app.stringIDToTypeID(s);
    };

    var descriptor = new ActionDescriptor();
    var reference = new ActionReference();
    var reference2 = new ActionReference();

    reference.putProperty( s2t( "channel" ), s2t( "selection" ));
    descriptor.putReference( c2t( "null" ), reference );
    reference2.putEnumerated( s2t( "channel" ), s2t( "channel" ), s2t( "transparencyEnum" ));
    descriptor.putReference( s2t( "to" ), reference2 );
    executeAction( s2t( "set" ), descriptor, DialogModes.NO );
}

function addLayerMask() {
    var c2t = function (s) {
        return app.charIDToTypeID(s);
    };

    var s2t = function (s) {
        return app.stringIDToTypeID(s);
    };

    var descriptor = new ActionDescriptor();
    var reference = new ActionReference();

    descriptor.putClass( s2t( "new" ), s2t( "channel" ));
    reference.putEnumerated( s2t( "channel" ), s2t( "channel" ), s2t( "mask" ));
    descriptor.putReference( s2t( "at" ), reference );
    descriptor.putEnumerated( s2t( "using" ), c2t( "UsrM" ), s2t( "revealSelection" ));
    executeAction( s2t( "make" ), descriptor, DialogModes.NO );
}

function addMask(){

    try{
        loadLayerSelection();
        addLayerMask();
        } catch (e) {
            deleteLayerMask(true);
        }
};


function deleteLayerMask(apply) {
    var c2t = function (s) {
        return app.charIDToTypeID(s);
    };

    var s2t = function (s) {
        return app.stringIDToTypeID(s);
    };

    var descriptor = new ActionDescriptor();
    var reference = new ActionReference();

    reference.putEnumerated( s2t( "channel" ), s2t( "channel" ), s2t( "mask" ));
    descriptor.putReference( c2t( "null" ), reference );
    descriptor.putBoolean( s2t( "apply" ), apply );
    executeAction( s2t( "delete" ), descriptor, DialogModes.NO );
}

function make_transparent_mask_from_bw (mask_layer) {
    if (mask_layer == null) {
        var mask_layer = activeDocument.activeLayer
    }

    var layer_solid = createSolidColorLayer(255,255,255);
    
    // CREATE MASK
    // Copy data for Mask
    activeDocument.activeLayer = mask_layer;
    activeDocument.selection.selectAll();
    activeDocument.selection.copy();
    
    // create mask on selected layer
    activeDocument.activeLayer = layer_solid;

    // paste data into selected Mask
    selectMask(layer_solid.name)
    activeDocument.selection.selectAll();
    try {activeDocument.paste();} catch(e) {}

    mask_layer.remove()

    return layer_solid
}


function rasterize_selected_layer () {
    var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
    var desc1196 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref138 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref138.putEnumerated( idLyr, idOrdn, idTrgt );
    desc1196.putReference( idnull, ref138 );
    executeAction( idrasterizeLayer, desc1196, DialogModes.NO );
}

function apply_selected_layer_mask () {
    var id1949 = charIDToTypeID( "Dlt " );
    var desc398 = new ActionDescriptor();
    var id1950 = charIDToTypeID( "null" );
    var ref291 = new ActionReference();
    var id1951 = charIDToTypeID( "Chnl" );
    var id1952 = charIDToTypeID( "Chnl" );
    var id1953 = charIDToTypeID( "Msk " );
    ref291.putEnumerated( id1951, id1952, id1953 );
    desc398.putReference( id1950, ref291 );
    var id1954 = charIDToTypeID( "Aply" );
    desc398.putBoolean( id1954, true );
    executeAction( id1949, desc398, DialogModes.NO );
}

function deleteLayerMask(apply) {
    
}


// ==================================================================
// SUPER SPECIFIC

// used for iographics Figma export
// replaces the placeholder in generic file name string
// '{item-'+ item.name+'}_{cam-'+cam+'}_{mat-'+material+'}_{element-'+pose_grp+'}_{pass-render_pass_string_name_placeholder}''
function replace_placeholder_in_render_pass_string(render_alias_for_figma, file_name) {
    file_name = file_name.replace('render_pass_string_name_placeholder', render_alias_for_figma)
    return file_name
}