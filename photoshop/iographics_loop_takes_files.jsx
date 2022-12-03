#include 'C:/Users/kosty/Documents/Adobe Scripts/iographics_modules/iographics_general_functions.jsx'
#include 'C:/Users/kosty/Documents/Adobe Scripts/libs/clearConsoleExtendScriptToolkit.js'
#include 'C:/Users/kosty/Documents/Adobe Scripts/libs/json2.js'

/* 

    IO GRAPHICS - LOOP TAKES & THEIR FILES

*/

// Custom per-project values:
// function export_aliases (render, material, output_variant) 
    // returns 
// function render_variations (render, material)


/* DOC */
/*  
    ВВЕДЕНИЕ:
    Основное отличие этого скрипта, от gg_render_compositing в том, 
    что gg сначала наполняет doc рендерами, а потом их сортирует и обрабатывает,
    а io_render_to_figma работает с содержимым папки take_folder_c, 
    к каждому рендеру применяется разный алгоритм (открытие, постобработка, экспорт)
    

    ПРОГРАММА:

    User Input
        - Files / folders
        - Client Aliases
        - Render Variations
    
    render_db

    main LOOP starts:
        <1> for Item:
            - item_path составляем

            <2> for Material:

                <3> for Camera:
                    
                    <4> for pose_grp:
                        - pose_int, pose_grps (array)
                        - loop_cycles (сколько pose_grps = столько циклов)

                            <5> for pose_grp:
                                - take_name, psd_name составить
                                

                        - take_path
                        - получаем Folder для take_folder
                        - содержимое назначаем в take_folder_c

                        <CHECK> if material is NOT additional pass:
                            do normal algorythm ↓ 
                            
                            работа с рендерами, содержимым take_folder_c:
                                для каждого файла рендера свой алгоритм based on file name
                                
                                <6> loop cycles_of_processing 
                                (т.к. из некоторых файлов мы делаем несколько версий экспорта):
                                    
                            
                            save PNG
                        else:
                            do algorithm for additional pass ↓


*/
/*  */


function get_pose_grps_from_render_db_pose (item, pose_int) {
    // pass here:
    // - the item db entry
    // - the pose number
    // Returns: Array with numbers (integers) of pose_grp_

    var pose_grps = null;
    var regex_string = /(?:grp_?)\d_?\d?/

    // if any pose exist
    if (item.poses.length) {
        // for each pose in poses        
        for (p_i in item.poses) {
            var pose = item.poses[p_i];
                
            // choose the right pose
            if ( pose.pose_int == pose_int ) {
                
                // if any pose_grps exist
                if (pose.pose_grps.length) {
                    pose_grp_array = []
                    pose_grp_numbers = pose.pose_grps; // Array
                    for (pg_i in pose_grp_numbers) {
                        // get the String
                        pose_grp_numbers[pg_i] = regex_string.exec(pose_grp_numbers[pg_i]);
                        pose_grp_array[pg_i] = pose_grp_numbers[pg_i].toString().replace('grp_', '').replace('grp', '')
                    }
                    pose_grps = pose_grp_array
                }
            }

            
        }
    }

    return pose_grps;

}

function iographics_loop_takes_files ( recipe_data ) {
    // в recipe_data находится переданный user_input и уникальные методы для конкретного проекта
    // Путь папки рендеров и json файлу db
    var job_type                 = recipe_data.job_type
    var project_folder      = recipe_data.project_folder
    var render_iteration    = recipe_data.render_iteration
    var renders_folder      = recipe_data.renders_folder
    var export_folder       = recipe_data.export_folder
    var render_db_json      = recipe_data.render_db_json
    
    // Custom per-project values
    var export_aliases                  = recipe_data.export_aliases
    var recipe_processing_function      = recipe_data.recipe_processing_function
    var render_usage_processing_cycles  = render_usage_processing_cycles
    

    // DB  -> render_db
        // json -> js object
        // Чтение json файла и запись содержимого в js-объект render_db
        render_db_json = File(render_db_json)
        render_db_json.open('r');
        var render_db = render_db_json.read();
        render_db = JSON.parse(render_db);
        render_db_json.close();
    //

    var dimensions = {
        x: render_db.settings.resX,
        y: render_db.settings.resY
    };

    var items       = render_db.items;
    var materials   = render_db.materials;
    var cameras     = render_db.cameras;

    var sep = '_-_';

    // <1> for item
    for (ii in items) {
        var item = items[ii];
        
        var item_path = new Folder ( renders_folder + '/' + item.name );

        // <2> for material
        for (im in materials) {
            var material = materials[im];

            // <3> for camera
            for (ic in cameras) {
                var camera = cameras[ic];

                // <4> for pose_grps
                pose_int = item.cam_poses[camera.name]
                pose_grps = get_pose_grps_from_render_db_pose(item, pose_int)
                
                // <+> pose_grps_total - сколько у одного тейка pose_grps
                if (pose_grps) { pose_grps_total = pose_grps.length; }
                else {  pose_grps_total = 1; }

                // loop pose_grps
                for (var pgrp_loop_i = 0; pgrp_loop_i < pose_grps_total; pgrp_loop_i++) {
                    // ===========================================================================
                    // Create special take_name and psd_name
                    // (for pose_grp or NO pose_grp)
                    var take_name = item.name + sep + material + sep + camera.name
                    
                    // Create psd_name
                    // if only one material and it is GG_DEFAULT job_type - then we don't need 'Material'-folder at export
                    if (materials.length == 1 && job_type == 'GG_DEFAULT') {
                        psd_name = item.name + ' - ' + camera.name
                    }
                    else {
                        psd_name = item.name + ' - ' + material + ' - ' + camera.name
                    }
                    
                    // if pose_grps exist - add it to name string
                    if (pose_grps) {
                        take_name = take_name + sep + 'grp_' + pose_grps[pgrp_loop_i]
                        
                        if (job_type == 'RENDER_TO_FIGMA') {
                            psd_name = psd_name + ' ' + 'grp_' + pose_grps[pgrp_loop_i]
                        }
                        else {
                            psd_name = psd_name + ' ' + 'v_' + pose_grps[pgrp_loop_i]
                        }

                    }

                    take_name = replaceInString(take_name, ' ', '_');
                    var take_path = renders_folder + '/' + item.name + '/' + take_name;
                    var take_folder = new Folder(take_path);
                    var take_folder_c = take_folder.getFiles();

                    recipe_processing_data = {
                        recipe_data: recipe_data,
                        render_db: render_db,
                        item: item,
                        material: material, 
                        camera: camera,
                        take_name: take_name,
                        psd_name: psd_name,
                        take_path: take_path,
                        take_folder: take_folder, 
                        take_folder_c: take_folder_c
                    }

                    if (pose_grps) {
                        recipe_processing_data.pose_grp = pose_grps[pgrp_loop_i]
                    }
                
                    // ===========================================================================
                    recipe_processing_function (recipe_processing_data) 
                
                } ///. end of - pose_grps
            } ///. end of - for camera
        } ///. end of - for material
    } ///. end of - for item
}