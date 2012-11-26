class RenameArticleid < ActiveRecord::Migration
  def change
  	rename_column(:photos, :articleid, :article_id)
  end
end
