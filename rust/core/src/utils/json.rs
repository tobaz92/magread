use base64::{self, Engine};
use std::fs;

use flate2::write::GzEncoder;
use flate2::Compression;
use std::io::prelude::*;

pub fn save_json(data: Vec<Vec<(String, [f32; 6])>>, path: &str, filename: &str) -> () {
    let json_data = serde_json::to_value(data).expect("Failed to convert data to JSON");

    // let string_json = serde_json::to_string_pretty(&json_data).unwrap();
    // fs::write(format!("{}/{}", path, filename), string_json).expect("Unable to write data to file");

    // let base64_json = text_to_base64(&string_json);
    // fs::write(format!("{}/{}", path, filename), base64_json).expect("Unable to write data to file");

    let compress_json_data = compress_json(&json_data.to_string());
    let compress_json_data_base64 = base64::engine::general_purpose::STANDARD.encode(&compress_json_data);


    fs::write(format!("{}/{}", path, filename), compress_json_data_base64)
        .expect("Unable to write data to file");

    // println!("{}", &json_data);
}

// fn text_to_base64(text: &str) -> String {
//     let base64 = base64::engine::general_purpose::STANDARD.encode(text);
//     base64
// }

fn compress_json(data: &str) -> Vec<u8> {
    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(data.as_bytes()).expect("Échec de la compression");
    encoder.finish().expect("Échec de la finalisation de la compression")
}
