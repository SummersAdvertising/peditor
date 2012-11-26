class Photo < ActiveRecord::Base
  belongs_to :article
  attr_accessible  :image
  mount_uploader :image, ImageUploader  
end
