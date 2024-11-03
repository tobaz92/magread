use crate::utils::args::Args;
use crate::utils::crop::set_coords_images;
use crate::utils::directory_utils::{copy_files_in_folder, remove_folder, reset_folder};
use crate::utils::extract::extract_jpg;
use crate::utils::img::{crop_imgs, open_imgs};
use crate::utils::json::save_json;
use crate::utils::token::token_generator;
use std::error::Error;

pub fn process_files(args: &Args) -> Result<(), Box<dyn Error>> {
    let token = token_generator();

    let temp_folder = "./temp";
    let temp_folder_token = format!("{}/{}", temp_folder, token);

    let folders = ["jpg", "json", "thumbnail", "crop"]
        .iter()
        .map(|folder| format!("{}/{}/{}", temp_folder, token, folder))
        .collect::<Vec<_>>();

    let jpg_folder = &folders[0];
    let json_folder = &folders[1];
    let thumbnail_folder = &folders[2];
    let crop_folder = &folders[3];

    reset_folder(&args.folder_output)?;
    
    for folder in folders.clone() {
        reset_folder(&folder)?;
    }

    let files = extract_jpg(&args.folder_pdf, jpg_folder, &args.nb_page);

    let imgs_open = open_imgs(files.clone());

    let coords = set_coords_images(files.clone(), imgs_open.clone());

    let crop_imgs_data = crop_imgs(coords.clone(), imgs_open.clone(), crop_folder);

    let data = crop_imgs_data[0].clone();
    let thumbnail = crop_imgs_data[1].clone();
    save_json(data.clone(), json_folder, "tempvars.d");
    save_json(thumbnail.clone(), json_folder, "interfacelayout.d");

    let _copy_json = copy_files_in_folder(json_folder, &args.folder_output);

    let _copy_imgs = copy_files_in_folder(crop_folder, &args.folder_output);

    copy_files_in_folder(thumbnail_folder, &args.folder_output)?;

    remove_folder("./temp")?;
    remove_folder(&temp_folder_token)?;

    Ok(())
}
