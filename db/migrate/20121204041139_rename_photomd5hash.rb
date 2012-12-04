class RenamePhotomd5hash < ActiveRecord::Migration
  def change
  	rename_column(:photos, :md5hash, :name)
  end
end
