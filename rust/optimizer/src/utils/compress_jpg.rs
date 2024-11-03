use std::{
    fs::{self, File},
    io::{BufReader, Write},
    sync::Arc,
};

use image::{DynamicImage, GenericImageView, ImageFormat};
use rayon::prelude::*;
use webp::Encoder;

pub fn compress_jpg_function(input_folder: &str) {
    let files = Arc::new(get_files_in_folder(input_folder));

    // Parallel processing using rayon
    files.par_iter().for_each(|file| {
        compress_and_convert_image(&file, 80).unwrap_or_else(|err| {
            eprintln!("Error processing file {}: {}", file, err);
        });
        println!("Compressed: {}", file);
    });
}

fn get_files_in_folder(input_folder: &str) -> Vec<String> {
    let mut files = vec![];

    let paths = fs::read_dir(input_folder).unwrap();

    for path in paths {
        let path = path.unwrap().path();
        let path_str = path.to_str().unwrap().to_string();
        if path_str.ends_with(".jpg") {
            files.push(path_str);
        }
    }

    files
}

fn compress_and_convert_image(
    input_path: &str,
    quality: u8,
) -> Result<(), Box<dyn std::error::Error>> {
    let input_file = File::open(input_path)?;
    let reader = BufReader::new(input_file);

    let image = image::load(reader, ImageFormat::Jpeg)?;

    // Convert and save as WebP with the specified quality
    let dynamic_image = DynamicImage::ImageRgb8(image.to_rgb8());
    let (width, height) = dynamic_image.dimensions();
    let rgb_data = dynamic_image.to_rgb8().into_raw();
    let webp_encoder = Encoder::from_rgb(&rgb_data, width, height);
    let webp_data = webp_encoder.encode(quality as f32);

    let output_path = input_path.replace(".jpg", ".webp");

    let mut output_webp = File::create(output_path)?;
    output_webp.write_all(&webp_data)?;

    Ok(())
}
