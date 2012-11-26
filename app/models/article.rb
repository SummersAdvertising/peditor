class Article < ActiveRecord::Base
  has_many :photos, :dependent => :destroy
  attr_accessible :content, :name
end
