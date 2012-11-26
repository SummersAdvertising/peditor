class AddArticleidToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :articleid, :int
  end
end
