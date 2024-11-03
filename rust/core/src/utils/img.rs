// use image::*;
use rand::Rng;

use rayon::prelude::*;
use image::DynamicImage;

// pub fn open_imgs(files: Vec<String>) -> Vec<DynamicImage> {
//     let mut imgs = Vec::with_capacity(1);

//     for file in &files {
//         let img = open_img(file).unwrap();
//         imgs.push(img);
//     }

//     imgs
// }


pub fn open_imgs(files: Vec<String>) -> Vec<DynamicImage> {
    files
        .par_iter()  // Utilise un itérateur parallèle
        .map(|file| open_img(file).unwrap())  // Ouvre chaque image en parallèle
        .collect()  // Collecte les résultats dans un vecteur
}

pub fn open_img(file: &str) -> Result<DynamicImage, String> {
    let img = match image::open(file.to_string()) {
        Ok(img) => img,
        Err(e) => {
            eprintln!("Failed to open image {}: {}", file, e);
            return Err(format!("Failed to open image {}: {}", file, e));
        }
    };

    Ok(img)
}





pub fn crop_imgs(
    coords: Vec<Vec<[f32; 5]>>,
    mut imgs_open: Vec<DynamicImage>,
    folder_output_temp: &str,
) -> Vec<Vec<Vec<(String, [f32; 6])>>> {
    // [f32; 6] pour gérer les coordonnées en flottants
    let mut array_json = Vec::with_capacity(5);
    let mut count_coord_img = 0f32;
    let mut _count_coord_img_int = 0i32;

    let mut array_json_thumbnail = Vec::with_capacity(5);

    for coord in coords {
        let key_files = count_coord_img as usize;

        let mut x: f32;
        let mut y: f32;
        let mut w: f32;
        let mut h: f32;

        let mut array_json_image = Vec::with_capacity(5);

        let img = &mut imgs_open[key_files];
        let (real_w, real_h) = (img.width() as f32, img.height() as f32); // Conversion en f32

        let file_name_thumbnail = export_thumbnail(img, folder_output_temp);

        array_json_thumbnail.push(file_name_thumbnail);

        for decoupe in coord {
            x = decoupe[1];
            y = decoupe[2];
            w = decoupe[3];
            h = decoupe[4];

            let img = &img.crop(
                x.round() as u32, // On arrondit à l'entier le plus proche pour l'appel à la fonction crop
                y.round() as u32,
                w.round() as u32,
                h.round() as u32,
            );

            let file_name = format!(
                "{}/{}.jpg",
                folder_output_temp,
                format!("{:x}", rand::thread_rng().gen::<u32>())
            );

            img.save(file_name.clone()).unwrap();

            let file_name_clean: String = file_name
                .replace(folder_output_temp, "")
                .chars()
                .skip(1)
                .collect();

            let data_file = (file_name_clean, [x, y, w, h, real_w, real_h]);

            array_json_image.push(data_file);

            _count_coord_img_int += 1;
        }

        array_json.push(array_json_image);

        count_coord_img += 1.0;
    }

    let arrays_array_thumbnail = vec![
        array_json.clone(),
        vec![array_json_thumbnail
            .into_iter()
            .map(|file_name| (file_name, [0.0; 6]))
            .collect()],
    ];

    arrays_array_thumbnail
}

fn export_thumbnail(img: &mut DynamicImage, folder_output_temp: &str) -> String {
    let folder_output_temp_thumbnail = folder_output_temp.replace("crop", "thumbnail");
    
    // Prépare le nom du fichier et le chemin de sortie
    let random_id = rand::random::<u32>();
    let file_path = format!("{}/{}.jpg", folder_output_temp_thumbnail, format!("{:x}", random_id));

    // Crée la miniature et enregistre l'image
    img.thumbnail(300, 300).save(&file_path).unwrap();

    file_path
}
