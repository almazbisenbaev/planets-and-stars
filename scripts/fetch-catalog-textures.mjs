// Reproduce the added local texture assets from their credited source files.
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const directory = new URL('../public/textures/', import.meta.url);
const jpl = 'https://space.jpl.nasa.gov/tmaps/';
const entries = [
  ['io', 'jup1vss2.jpg', 'jupiter', 'Voyager mosaic with Galileo color; polar coverage is incomplete.'],
  ['europa', 'jup2vss2.jpg', 'jupiter', 'Cleaned Voyager grayscale mosaic.'],
  ['ganymede', 'jup3vss2.jpg', 'jupiter', 'Cleaned Voyager grayscale mosaic.'],
  ['callisto', 'jup4vss2.jpg', 'jupiter', 'Cleaned Voyager grayscale mosaic.'],
  ['mimas', 'sat1vss2.jpg', 'saturn', 'Cleaned Voyager mosaic.'],
  ['enceladus', 'sat2vss2.jpg', 'saturn', 'Cleaned Voyager mosaic; predates Cassini.'],
  ['titan', 'sat6fss1.jpg', 'saturn', 'Illustrative haze map by David Seal with Voyager-based color; not a surface map.'],
  ['triton', 'nep1vuu2.jpg', 'neptune', 'Limited Voyager coverage; unmapped regions remain visible.'],
].map(([id, original, system, note]) => ({
  file: `${id}_jpl.jpg`, original_url: `${jpl}pix/${original}`,
  source_page: `${jpl}${system}.html`,
  credit: id === 'titan' || id === 'io' ? 'NASA/JPL-Caltech; David Seal' : 'NASA/JPL-Caltech/USGS', note,
}));
entries.push({file:'pluto_nh.jpg', original_url:'https://d2pn8kiwq2w21t.cloudfront.net/original_images/jpegPIA19858.jpg', source_page:'https://www.jpl.nasa.gov/images/pia19858-global-map-of-pluto/', credit:'NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute', note:'New Horizons July 2015 grayscale mosaic. Resolution varies greatly; the unobserved south polar region is blank.', resize:true});
const assets = [];
for (const entry of entries) {
  const input = execFileSync('curl',['--fail','--silent','--show-error','--location','--max-time','45',entry.original_url], {maxBuffer:20*1024*1024});
  const buffer = entry.resize ? await sharp(input).resize({width:2048}).jpeg({quality:90}).toBuffer() : input;
  const {width,height} = await sharp(buffer).metadata();
  if (width !== 2*height) throw new Error(`Expected equirectangular map: ${entry.file} ${width}x${height}`);
  await writeFile(new URL(entry.file,directory),buffer);
  const {resize,...metadata} = entry;
  assets.push({...metadata, size:[width,height], bytes:buffer.length, sha256:createHash('sha256').update(buffer).digest('hex'), changes:resize?'Resampled to 2048 × 1024; JPEG quality 90':'none'});
  console.log(entry.file, `${width}x${height}`, buffer.length);
}
await writeFile(new URL('catalog-attribution.json',directory),JSON.stringify({retrieved:'2026-09-27',license:'JPL Image Use Policy',license_url:'https://www.jpl.nasa.gov/jpl-image-use-policy/',assets},null,2)+'\n');
