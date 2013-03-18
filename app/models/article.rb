class Article < ActiveRecord::Base
  has_many :photos, :dependent => :destroy
  attr_accessible :content, :name

  #delete the blank diretory built by carrierwave
  before_destroy :remember_id
  after_destroy :remove_id_directory

  protected
  def remember_id
    @id = id
  end

  def remove_id_directory
    FileUtils.remove_dir("#{Rails.root}/public/uploads/#{@id}", :force => true)
  end
end
