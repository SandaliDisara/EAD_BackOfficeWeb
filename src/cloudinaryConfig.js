import { Cloudinary } from 'cloudinary-core';

const cloudinary = new Cloudinary({ 
  cloud_name: 'dvumcfocl', 
  secure: true 
});

export default cloudinary;
