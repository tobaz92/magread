use image::*;
use rand::rngs::SmallRng;
use rand::{Rng, SeedableRng};

pub fn set_coords_images(files: Vec<String>, imgs_open: Vec<DynamicImage>) -> Vec<Vec<[f32; 5]>> {
    let mut coords = Vec::with_capacity(files.len()); // Remplacer 1 par la longueur de `files`

    for (count_file, _file) in files.iter().enumerate() {
        let mut img_coords = Vec::with_capacity(5);

        let img = &imgs_open[count_file];

        let (dim_x, dim_y) = img.dimensions();

        let xs = get_lines(dim_x as f32, get_min_max(4.0, 6.0) as usize);
        let ys = get_lines(dim_y as f32, get_min_max(4.0, 6.0) as usize);

        let mut count_img = 0.0;
        for y_base in &ys {
            let (y, h) = (y_base[0], y_base[1]);

            for x_base in &xs {
                let (x, w) = (x_base[0], x_base[1]);

                img_coords.push([count_img, x, y, w, h]);
                count_img += 1.0;
            }

            count_img += 1.0;
        }

        coords.push(img_coords);
    }

    coords
}

fn get_lines(max: f32, len: usize) -> Vec<[f32; 2]> {
    if len as f32 > max {
        panic!("nb_lines doit être inférieur ou égal à dim");
    }

    let mut arr: Vec<[f32; 2]> = Vec::with_capacity(len);
    let mut start = 0.0_f32;
    let mut rng = SmallRng::from_entropy();

    for i in 0..len {
        let remaining = max - start;
        let n = len - i;

        let width = if n == 1 {
            remaining
        } else {
            let max_width = (remaining / n as f32).max(1.0);
            rng.gen_range(1.0..=max_width)
        };

        arr.push([start, width]);
        start += width;
    }

    arr
}

fn get_min_max(min: f32, max: f32) -> f32 {
    let mut rng = SmallRng::from_entropy(); // Utilisation cohérente de SmallRng pour la reproductibilité
    rng.gen_range(min..=max)
}

// use image::*;
// use rand::rngs::SmallRng;
// use rand::{Rng, SeedableRng};
// pub fn set_coords_images(files: Vec<String>, imgs_open: Vec<DynamicImage>) -> Vec<Vec<[f32; 5]>> {
//     let mut coords = Vec::with_capacity(1);

//     let mut count_file = 0;
//     for _file in &files {
//         let mut img_coords = Vec::with_capacity(5);

//         let img = &imgs_open[count_file as usize];

//         let (dim_x, dim_y) = img.dimensions();

//         let xs = get_lines(dim_x as f32, get_min_max(4.0, 6.0));
//         let ys = get_lines(dim_y as f32, get_min_max(4.0, 6.0));

//         let mut count_img = 0f32;
//         for y_base in ys {
//             let y = y_base[0];
//             let h = y_base[1];

//             let mut _count_x = 0f32;
//             for x_base in &xs {
//                 let x = x_base[0];
//                 let w = x_base[1];

//                 _count_x += 1.0;

//                 img_coords.push([count_img, x, y, w, h]);

//                 count_img += 1.0;
//             }

//             count_img += 1.0;
//         }

//         coords.push(img_coords);

//         count_file += 1;
//     }

//     coords
// }

// // fn get_lines(max: f32, len: f32) -> Vec<[f32; 2]> {
// //     if len > max {
// //         panic!("nb_lines doit être inférieur ou égal à dim");
// //     }

// //     let mut arr: Vec<[f32; 2]> = Vec::with_capacity(len as usize);
// //     let mut start: f32 = 0.0;
// //     let mut rng = rand::thread_rng();

// //     for i in 0..len as usize {
// //         let width: f32 = if i == len as usize - 1 {
// //             max - start
// //         } else {
// //             let remaining = max - start;
// //             let max_width = remaining / (len - i as f32);
// //             rng.gen_range(1.0..=max_width.max(1.0))
// //         };

// //         arr.push([start, width]);
// //         start += width;
// //     }

// //     arr
// // }

// fn get_lines(max: f32, len: usize) -> Vec<[f32; 2]> {
//     if len as f32 > max {
//         panic!("nb_lines doit être inférieur ou égal à dim");
//     }

//     let mut arr: Vec<[f32; 2]> = Vec::with_capacity(len);
//     let mut start = 0.0_f32;
//     let mut rng = SmallRng::from_entropy();

//     for i in 0..len {
//         let remaining = max - start;
//         let n = len - i;

//         let width = if n == 1 {
//             remaining
//         } else {
//             let max_width = (remaining / n as f32).max(1.0);
//             rng.gen_range(1.0..=max_width)
//         };

//         arr.push([start, width]);
//         start += width;
//     }

//     arr
// }

// fn get_min_max(min: f32, max: f32) -> f32 {
//     let mut rng = rand::thread_rng();
//     rng.gen_range(min..=max)
// }
