class Photo < ActiveRecord::Base
  belongs_to :article
  attr_accessible  :image

  mount_uploader :image, ImageUploader
  
  before_create :update_filename
  #validates_uniqueness_of :name, :on => :create
  
  private
  def update_filename
  	self.name = image.file.filename
  end

end
