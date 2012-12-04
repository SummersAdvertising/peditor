class Addmd5hashToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :md5hash, :string
  end
end
