class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick
  storage :file

  def store_dir
    "uploads/#{model.article_id}"
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end

  #process :resize_to_fit => [800, 800] #define the size of imgs.

  #version :thumb do #define version "thumb"
    #process :resize_to_fill => [50,50] #the size of thumb should be 200*200
  #end
  #<%= image_tag(@user.photo_url(:thumb)) %> use the thumb version in view

end
